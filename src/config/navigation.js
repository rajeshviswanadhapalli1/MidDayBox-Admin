import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  School,
  Receipt,
  Shield,
} from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", permissionKey: "dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", permissionKey: "users", icon: Users },
  { name: "Orders", href: "/orders", permissionKey: "orders", icon: Package },
  { name: "Prices", href: "/prices", permissionKey: "prices", icon: DollarSign },
  { name: "Schools", href: "/schools", permissionKey: "schools", icon: School },
  { name: "Transactions", href: "/transactions", permissionKey: "transactions", icon: Receipt },
  { name: "Sub Admins", href: "/sub-admins", permissionKey: "sub_admins", icon: Shield },
  { name: "Feedbacks", href: "/feedbacks", permissionKey: "feedbacks", icon: TrendingUp },
];

