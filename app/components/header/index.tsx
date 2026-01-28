"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import Burger from "./burger";
import Stairs from "./stairs";
import Menu from "./menu";
import { AnimatePresence } from "framer-motion";

interface HeaderProps {
  isScrolled?: boolean;
}

export default function Header({
  isScrolled: passedIsScrolled = false,
}: HeaderProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(passedIsScrolled);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsScrolled(passedIsScrolled);
  }, [passedIsScrolled]);

  useEffect(() => {
    // Dispatch custom event for menu state change
    const event = new CustomEvent("navigationMenuStateChange", {
      detail: { isOpen: menuIsOpen },
    });
    document.dispatchEvent(event);
  }, [menuIsOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);

      // Direct DOM manipulation for color changes
      if (headerRef.current) {
        const lines = headerRef.current.querySelectorAll("svg line");
        const menuText = headerRef.current.querySelector(".burgerMenu p");

        if (scrolled) {
          lines.forEach((line) => {
            line.setAttribute("stroke", "black");
          });
          if (menuText) {
            (menuText as HTMLElement).style.color = "black";
          }
        } else {
          lines.forEach((line) => {
            line.setAttribute("stroke", "white");
          });
          if (menuText) {
            (menuText as HTMLElement).style.color = "white";
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openMenu = () => {
    setMenuIsOpen(true);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
  };

  return (
    <div
      className={styles.header}
      ref={headerRef}
      role="navigation"
      aria-label="Main Navigation"
    >
      <Burger
        openMenu={openMenu}
        closeMenu={closeMenu}
        isMenuOpen={menuIsOpen}
        isScrolled={isScrolled}
      />
      <AnimatePresence mode="wait">
        {menuIsOpen && (
          <>
            <Stairs />
            <Menu closeMenu={closeMenu} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
