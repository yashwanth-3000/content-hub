"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      label: "Instagram", 
      href: "/instagram", 
      icon: Instagram,
      gradient: "from-purple-600 via-pink-600 to-orange-500",
      activeGradient: "from-purple-400 via-pink-400 to-orange-300"
    },
    { 
      label: "YouTube", 
      href: "/youtube", 
      icon: Youtube,
      gradient: "from-red-600 to-red-700",
      activeGradient: "from-red-400 to-red-500"
    },
    { 
      label: "Twitter", 
      href: "/twitter", 
      icon: Twitter,
      gradient: "from-blue-400 to-blue-600",
      activeGradient: "from-blue-300 to-blue-500"
    },
    { 
      label: "LinkedIn", 
      href: "/linkedin", 
      icon: Linkedin,
      gradient: "from-blue-600 to-blue-800",
      activeGradient: "from-blue-500 to-blue-700"
    },
  ];

  return (
    <NextUINavbar
      position="sticky"
      className="border-none max-w-full flex justify-center items-center mx-auto mt-3 bg-black/50 backdrop-blur-xl"
    >
      <NavbarContent className="flex w-full justify-between items-center">
        <NavbarBrand as="li" className="gap-3">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span className="font-bold text-2xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                Content Hub
              </motion.span>
              <motion.div
                className="absolute inset-0 rounded-lg blur-xl bg-gradient-to-r from-blue-400/20 to-purple-600/20"
                animate={{ 
                  opacity: [0.4, 0.6, 0.4],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </NextLink>
        </NavbarBrand>

        <AnimatePresence mode="wait">
          <ul className="hidden lg:flex gap-8 justify-center items-center ml-2">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NextLink
                    className={`relative text-lg font-medium flex items-center gap-2 transition-colors duration-200 ease-in-out`}
                    href={item.href}
                  >
                    <motion.div
                      className={`p-2 rounded-full ${
                        pathname === item.href
                          ? `bg-gradient-to-r ${item.activeGradient}`
                          : 'bg-transparent'
                      }`}
                      whileHover={{ 
                        scale: 1.1, 
                        background: `linear-gradient(to right, ${item.gradient.split(' ').pop()})` 
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <item.icon 
                        className={`w-5 h-5 ${
                          pathname === item.href ? 'text-white' : 'text-gray-300'
                        }`} 
                      />
                    </motion.div>
                    <span
                      className={
                        pathname === item.href
                          ? `text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`
                          : "text-gray-300 hover:text-white"
                      }
                    >
                      {item.label}
                    </span>
                    {pathname === item.href && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </NextLink>
                </motion.div>
              </NavbarItem>
            ))}
          </ul>
        </AnimatePresence>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle className="text-gray-300 hover:text-white" />
      </NavbarContent>

      <NavbarMenu className="bg-black/90 backdrop-blur-xl pt-6">
        <motion.div
          className="mx-4 mt-4 flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <motion.div
                whileHover={{ x: 10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className={`text-lg flex items-center gap-2`}
                  href={item.href}
                  size="lg"
                >
                  <motion.div
                    className={`p-2 rounded-full ${
                      pathname === item.href
                        ? `bg-gradient-to-r ${item.activeGradient}`
                        : 'bg-transparent'
                    }`}
                    whileHover={{ 
                      scale: 1.1, 
                      background: `linear-gradient(to right, ${item.gradient.split(' ').pop()})` 
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon 
                      className={`w-5 h-5 ${
                        pathname === item.href ? 'text-white' : 'text-gray-300'
                      }`} 
                    />
                  </motion.div>
                  <span
                    className={
                      pathname === item.href
                        ? `text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`
                        : "text-gray-300"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </NavbarMenuItem>
          ))}
        </motion.div>
      </NavbarMenu>
    </NextUINavbar>
  );
};