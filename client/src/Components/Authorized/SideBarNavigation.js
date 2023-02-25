import { BanknotesIcon, PowerIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  HomeModernIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useHistory } from "react-router-dom";
import React from "react";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, href: "#", current: true, value: 0 },
  {
    name: "Billing",
    icon: BanknotesIcon,
    href: "#",
    count: 0,
    current: false,
    value: 1,
  },
  {
    name: "Products",
    icon: HomeModernIcon,
    href: "#",
    count: 0,
    current: false,
    value: 2,
  },
  { name: "Calendar", icon: CalendarIcon, href: "#", current: false, value: 3 },
  { name: "Documents", icon: InboxIcon, href: "#", current: false, value: 4 },
  {
    name: "Logout",
    icon: PowerIcon,
    href: "#",
    count: 0,
    current: false,
    value: 5,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SideBarNavigation() {
  const history = useHistory();
  const token = localStorage.getItem("token");

  const clickHandler = (e) => {
    if (e?.value === 5) {
      localStorage.clear();
      window.location.href = "/login";
    } else if (e?.value === 2) {
      history.push("/products");
    } else if (e?.value === 0) {
      history.push("/dashboard");
    } else if (e?.value === 1) {
      history.push("/billing");
    }
  };
  return (
    <div className="hidden sm:flex min-h-0 sm:flex-1 sm:flex-col bg-gray-800">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <nav
          className="mt-5 flex-1 space-y-1 bg-gray-800 px-2"
          aria-label="Sidebar"
        >
          {navigation.map((item) => (
            <div
              key={item.name}
              onClick={() => clickHandler(item)}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              )}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-gray-300"
                    : "text-gray-400 group-hover:text-gray-300",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {item.count ? (
                <span
                  className={classNames(
                    item.current
                      ? "bg-gray-800"
                      : "bg-gray-900 group-hover:bg-gray-800",
                    "ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full"
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
      <div className="fixed bottom-0 flex flex-shrink-0 p-4">
        <a href="#" className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tom Cook</p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                View profile
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
