"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import styles from "./style.module.scss";

interface BurgerProps {
  openMenu: () => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
  isScrolled: boolean;
}

export default function Burger({
  openMenu,
  closeMenu,
  isMenuOpen,
  isScrolled,
}: BurgerProps) {
  const burger = {
    closed: {
      rotate: 0,
    },
    opened: {
      rotate: 0,
    },
  };

  const iconVariants = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };

  const closeIconVariants = {
    closed: {
      opacity: 0,
    },
    opened: {
      opacity: 1,
    },
  };

  const menuTextVariants = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };

  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (burgerRef.current && !isMenuOpen) {
      const burgerElement = burgerRef.current;

      const handleMouseEnter = () => {
        const menuIcon = burgerElement.querySelector(".menu-icon");
        if (menuIcon) {
          gsap.to(menuIcon, {
            x: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const handleMouseLeave = () => {
        const menuIcon = burgerElement.querySelector(".menu-icon");
        if (menuIcon) {
          gsap.to(menuIcon, {
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      burgerElement.addEventListener("mouseenter", handleMouseEnter);
      burgerElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        burgerElement.removeEventListener("mouseenter", handleMouseEnter);
        burgerElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isMenuOpen]);

  return (
    <div className={styles.burgerContainer} ref={burgerRef}>
      <motion.div
        className={styles.burger}
        variants={burger}
        animate={isMenuOpen ? "opened" : "closed"}
        onClick={isMenuOpen ? closeMenu : openMenu}
      >
        <div className={styles.bounds}></div>
        <div className={styles.background}></div>
        <div className={"burgerMenu " + styles.burgerInner}>
          <motion.div
            className="menu-icon"
            variants={iconVariants}
            initial="closed"
            animate={isMenuOpen ? "opened" : "closed"}
            style={{ position: "relative", width: "62px", height: "15px" }}
          >
            <Image
              src="/menu-open.svg"
              alt="Menu"
              width={62}
              height={15}
              style={{ filter: isScrolled ? "none" : "invert(1)" }}
            />
          </motion.div>
          <motion.div
            className={`close-icon ${styles.closeIcon}`}
            variants={closeIconVariants}
            initial="closed"
            animate={isMenuOpen ? "opened" : "closed"}
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          >
            <span aria-hidden="true">×</span>
          </motion.div>
          <motion.p
            variants={menuTextVariants}
            initial="closed"
            animate={isMenuOpen ? "opened" : "closed"}
            style={{
              color: isScrolled ? "black" : "white",
              margin: 0,
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            MENU
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
