import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Skills.css'

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const techTags = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'GraphQL',
    'Apollo', 'Recoil', 'SCSS', 'Storybook', 'Styled', 'Emotion'
  ]

  const skillCards = [
    {
      title: 'React',
      items: [
        'redux, redux saga, recoil 등의 상태관리 라이브러리 사용 경험이 있습니다.',
        'next.js를 활용한 SSR 개발 경험이 있습니다.',
      ],
    },
    {
      title: 'Vue',
      items: [
        'vuex 사용 경험이 있습니다.',
        'Vue2 option api와 Vue3 composition api를 사용할 수 있습니다.',
      ],
    },
    {
      title: 'HTML/CSS',
      items: [
        '웹표준을 지키려 노력합니다.',
        'SCSS 문법에 익숙합니다.',
        'styled-component, emotion을 활용할 수 있습니다.',
        'BEM 방법론을 적용할 수 있습니다.',
        '크로스 브라우징에 대응할 수 있습니다.',
        'Antd, Chakra, Tailwind 등의 css 라이브러리를 사용할 수 있습니다.',
        'keyframe을 활용한 애니메이션 기법을 활용할 수 있습니다.',
      ],
    },
    {
      title: 'Javascript',
      items: [
        'ES6+ 문법에 익숙합니다.',
        'webpack, parcel 등의 번들러 사용 경험이 있습니다.',
        'typescript를 사용할 수 있습니다.',
        '디자인 시스템과 atomic 디자인에 대한 이해도가 높습니다.',
        'Jest를 활용한 테스트코드 작성 경험이 있습니다.',
        'Storybook 작성, 빌드 및 배포 경험이 있습니다.',
      ],
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
    <section id="skills" className="skills" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Strength.
        </motion.h2>

        <motion.div
          className="skills-tags"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {techTags.map((tag, index) => (
            <motion.span
              key={tag}
              className="tech-tag-round"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {skillCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="skill-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="skill-card-title">
                <span className="skill-title-badge">{card.title}</span>
              </div>
              <div className="skill-card-content">
                {card.items.map((item, idx) => (
                  <p key={idx} className="skill-item-text">
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
