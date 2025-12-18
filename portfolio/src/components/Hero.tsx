import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa'
import './Hero.css'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="hero" className="hero">
      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <motion.h1
            className="hero-name"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            안녕하세요
            <br />
            <span className="gradient-text">성장을 추구하는 개발자</span>
            <br />
            박건형입니다
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Frontend Developer
          </motion.p>
          <motion.div className="hero-links" variants={itemVariants}>
            <a
              href="mailto:qkrrjsgud49@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              <FaEnvelope />
              <span>Email</span>
            </a>
            <a
              href="https://github.com/rjsgud49"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/%EA%B1%B4%ED%98%95-%EB%B0%95-6631b8320/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              <FaLinkedin />
              <span>LinkedIn</span>
            </a>
            <a
              href="tel:010-5696-6817"
              className="hero-link"
            >
              <FaPhone />
              <span>Phone</span>
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-scroll"
          variants={itemVariants}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
