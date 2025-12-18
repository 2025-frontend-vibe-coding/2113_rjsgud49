import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaBlog } from 'react-icons/fa'
import { FaDiscord } from 'react-icons/fa'
import './Contact.css'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const contacts = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'qkrrjsgud49@gmail.com',
      link: 'mailto:qkrrjsgud49@gmail.com',
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: '010-5696-6817',
      link: 'tel:010-5696-6817',
    },
    {
      icon: <FaGithub />,
      label: 'GitHub',
      value: 'rjsgud49',
      link: 'https://github.com/rjsgud49',
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn',
      value: '박건형',
      link: 'https://www.linkedin.com/in/%EA%B1%B4%ED%98%95-%EB%B0%95-6631b8320/',
    },
    {
      icon: <FaDiscord />,
      label: 'Discord',
      value: 'rjsgud49',
      link: 'https://discord.com/users/rjsgud49',
    },
    {
      icon: <FaBlog />,
      label: 'Tech Blog',
      value: 'velog.io/@rjsgud49',
      link: 'https://velog.io/@rjsgud49/posts',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contact
        </motion.h2>

        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.p
            className="contact-intro"
            variants={itemVariants}
          >
            함께 일하고 싶은 개발자를 찾고 계신가요?
            <br />
            언제든지 연락주세요!
          </motion.p>

          <div className="contact-grid">
            {contacts.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="contact-icon">{contact.icon}</div>
                <div className="contact-info">
                  <span className="contact-label">{contact.label}</span>
                  <span className="contact-value">{contact.value}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p>Designed & Developed By 박건형</p>
          <p className="footer-year">© 2025</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
