import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Projects.css'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const projects = [
    {
      title: 'ROOMIT',
      mainFeature: '청년 주거 문제 해결 플랫폼',
      period: '2025.3 ~ 2025.7',
      teamSize: '4명',
      description: '청년 주거 문제 해결 플랫폼',
      tech: ['Vite', 'React', 'JavaScript', 'Spring', 'FastAPI'],
      role: '프론트엔드 개발',
      features: [
        '마이페이지 & 내 정보 수정 기능',
        'Socket.io를 활용한 실시간 1:1 채팅',
        '사용자 정보 관리 시스템',
        '개인의 생활 습관과 성향을 반영한 매칭 시스템',
      ],
    },
    {
      title: 'Echovo',
      mainFeature: 'AI 기반 기술면접 서비스',
      period: '2025.7 ~ 2025.8',
      teamSize: '1명',
      description: 'AI 기반 기술면접 서비스',
      tech: ['Vite', 'React', 'TypeScript', 'OpenAPI'],
      role: '개인 프로젝트',
      features: [
        'AI 기반 면접 질문 생성',
        '답변 수집 및 AI 피드백 제공',
        '면접 통계 시각화 (Recharts)',
        'PDF 출력 기능 (jsPDF)',
        '브라우저 마이크 권한 호출 구조 학습',
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.h2>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="project-card"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="project-main-title">
                <span className="project-title-tag">{project.mainFeature}</span>
              </div>
              
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-features">
                <ul>
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="project-period-badge">
                {project.period} ({project.teamSize})
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
