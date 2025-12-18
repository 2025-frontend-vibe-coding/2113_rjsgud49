import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './About.css'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="about-text">
            <p>
              성장을 추구하는 프론트엔드 개발자 박건형입니다.
            </p>
            <p>
              사용자 경험을 중시하며, 세련되고 직관적인 인터페이스를 만드는 것을 좋아합니다.
              새로운 기술을 배우고 적용하는 것에 열정을 가지고 있으며, 
              팀과의 협업을 통해 더 나은 결과물을 만들어내는 것을 즐깁니다.
            </p>
            <p>
              항상 배우려는 자세로, 다양한 프로젝트 경험을 통해 실력을 키워나가고 있습니다.
              문제 해결 능력과 커뮤니케이션 능력을 바탕으로 
              사용자에게 가치 있는 서비스를 제공하는 것이 목표입니다.
            </p>
          </div>
          <div className="about-links">
            <a
              href="https://www.notion.so/About-me-23239cf2021280c8b757ee693b90fbe3?pvs=21"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              Notion
            </a>
            <a
              href="https://velog.io/@rjsgud49/posts"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              Tech Blog
            </a>
            <a
              href="https://rjsgud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              Portfolio
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
