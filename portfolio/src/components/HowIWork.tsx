import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './HowIWork.css'

const HowIWork = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const principles = [
    {
      icon: '💡',
      title: '긍정적 영향',
      description: '회사와 세상에 긍정적 영향을 주는 일은 그 자체로 동기부여가 됩니다.',
    },
    {
      icon: '🎯',
      title: '과정의 즐거움',
      description: '목표 달성도 중요하지만 일의 과정에서 재미를 찾는 편이에요.',
    },
    {
      icon: '🔧',
      title: '문제 해결',
      description: '문제가 생겨도 그 상황 안에서 일을 진행할 수 있는 방향을 찾습니다.',
    },
    {
      icon: '📚',
      title: '학습 자세',
      description: '항상 배우려는 자세로 새로운 기술과 방법을 탐구합니다.',
    },
    {
      icon: '⏰',
      title: '약속 준수',
      description: '함께 정한 기한은 반드시 지키려고 노력해요.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="how-i-work" className="how-i-work" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          How I Work
        </motion.h2>

        <motion.div
          className="principles-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              className="principle-card"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="principle-icon">{principle.icon}</div>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="principle-description">{principle.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HowIWork
