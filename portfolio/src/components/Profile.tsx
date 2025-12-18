import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Profile.css'

const Profile = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const awards = [
    { title: '교내 캡스톤 프로젝트 금상', date: '2025.07.17' },
    { title: '교내동계 해커톤 장려상', date: '2024.01' },
    { title: '해커그라운드 해커톤 2024in의성 장려상', date: '2024.08' },
  ]

  const experiences = [
    { title: '교내 전공동아리 Ada 부장', date: '2024.09 ~' },
    { title: '교내 전공동아리 Ada 부원', date: '2024.09' },
    { title: '가족과 함께하는 디지털·SW-AI 체험캠프 생성형 AI활용 체험부스 운영', date: '2025.06' },
  ]

  const education = [
    { title: '경북소프트웨어마이스터고등학교', date: '2024.3' },
    { title: '2024 KDB Develop Youth Camp 2기 수료', date: '2024.7' },
  ]

  const licenses = [
    { title: '정보처리기능사', date: '2025.9' },
    { title: '리눅스 마스터', date: '2025.5' },
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="profile" className="profile" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Profile
        </motion.h2>

        <motion.div
          className="profile-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="profile-section" variants={itemVariants}>
            <h3 className="profile-section-title">🎖️ Awards & Experience</h3>
            <div className="profile-list">
              {awards.map((item, index) => (
                <motion.div
                  key={index}
                  className="profile-item"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <div className="profile-item-content">
                    <span className="profile-item-title">{item.title}</span>
                    <span className="profile-item-date">{item.date}</span>
                  </div>
                </motion.div>
              ))}
              {experiences.map((item, index) => (
                <motion.div
                  key={`exp-${index}`}
                  className="profile-item"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <div className="profile-item-content">
                    <span className="profile-item-title">{item.title}</span>
                    <span className="profile-item-date">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="profile-section" variants={itemVariants}>
            <h3 className="profile-section-title">🎓 Education & License</h3>
            <div className="profile-list">
              {education.map((item, index) => (
                <motion.div
                  key={`edu-${index}`}
                  className="profile-item"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <div className="profile-item-content">
                    <span className="profile-item-title">{item.title}</span>
                    <span className="profile-item-date">{item.date}</span>
                  </div>
                </motion.div>
              ))}
              {licenses.map((item, index) => (
                <motion.div
                  key={`lic-${index}`}
                  className="profile-item"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <div className="profile-item-content">
                    <span className="profile-item-title">{item.title}</span>
                    <span className="profile-item-date">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Profile
