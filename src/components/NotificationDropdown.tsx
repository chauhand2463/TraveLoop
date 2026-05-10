"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: "trip" | "budget" | "packing" | "general";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  { id: "1", type: "trip", title: "Trip Starting Soon", message: "Europe Summer 2026 starts in 3 days", time: "2 hours ago", read: false },
  { id: "2", type: "budget", title: "Budget Alert", message: "You've reached 80% of your accommodation budget", time: "1 day ago", read: false },
  { id: "3", type: "packing", title: "Packing Reminder", message: "Don't forget to add items for Japan trip", time: "2 days ago", read: true },
  { id: "4", type: "general", title: "Welcome to Traveloop", message: "Start planning your first adventure!", time: "1 week ago", read: true },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const typeIcons = {
    trip: <Calendar size={16} className="text-accent-cyan" />,
    budget: <DollarSign size={16} className="text-accent-yellow" />,
    packing: <MapPin size={16} className="text-accent-lime" />,
    general: <Bell size={16} className="text-accent-pink" />,
  };

  const typeColors = {
    trip: "bg-accent-cyan/10 border-accent-cyan/20",
    budget: "bg-accent-yellow/10 border-accent-yellow/20",
    packing: "bg-accent-lime/10 border-accent-lime/20",
    general: "bg-accent-pink/10 border-accent-pink/20",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-xl transition-all",
          "hover:bg-white/[0.06] text-muted hover:text-white"
        )}
      >
        <Bell size={18} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-accent-pink text-[10px] font-bold flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-3 w-[380px] max-h-[500px] bg-card border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-[80]"
            >
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-accent-cyan hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto max-h-[400px] p-2">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <Bell size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        "flex gap-4 p-4 rounded-xl cursor-pointer transition-all mb-1",
                        notification.read 
                          ? "hover:bg-white/[0.04]" 
                          : "bg-white/[0.04] hover:bg-white/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        typeColors[notification.type]
                      )}>
                        {typeIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-accent-cyan" />
                          )}
                        </div>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-muted">
                          <Clock size={10} />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
                <button className="w-full text-center text-sm text-accent-cyan hover:text-white transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}