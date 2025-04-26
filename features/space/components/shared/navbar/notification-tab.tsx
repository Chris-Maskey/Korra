"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  type: "like" | "comment" | "follow" | "order_status_update";
  post_id?: string;
  order_id?: string;
  message?: string;
  read: boolean;
  created_at: string;
};

export default function NotificationTab() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user?.id || null);
    };

    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data as Notification[]);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user, supabase]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((notification) =>
                notification.id === payload.new.id
                  ? (payload.new as Notification)
                  : notification,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } else {
      console.error("Error marking notification as read:", error);
      // Optionally show an error toast
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // Mark only unread notifications as read
    const unreadNotificationIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id);

    if (unreadNotificationIds.length === 0) return; // No unread notifications to mark

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadNotificationIds); // Use .in to update multiple rows

    if (!error) {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
    } else {
      console.error("Error marking all notifications as read:", error);
      // Optionally show an error toast
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // This function is now less critical as we have the 'message' field from the trigger
  // You might still use it for a fallback or specific formatting if needed
  const getNotificationMessage = (
    notification: Notification,
  ): React.ReactNode => {
    switch (notification.type) {
      case "like":
        return `${notification.sender_name} liked your post`;
      case "comment":
        return `${notification.sender_name} commented on your post`;
      case "follow":
        return `${notification.sender_name} started following you`;
      case "order_status_update":
        return notification.message || "Your order status has been updated";
      default:
        // Display the message field for unknown types or fallback
        return (
          notification.message ||
          `${notification.sender_name} interacted with you`
        );
    }
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={markAllAsRead}
                disabled={loading} // Disable button while loading or marking as read
              >
                Mark all as read
              </Button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "flex cursor-pointer flex-col gap-1 border-b p-3 transition-colors hover:bg-muted",
                        !notification.read && "bg-muted/50",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">
                            {getNotificationMessage(notification)}{" "}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at))}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
