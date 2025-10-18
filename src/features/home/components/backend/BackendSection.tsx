import Section from '../../common/components/Sections/Section.tsx';
 
const frontendLanguages = ['HTML', 'CSS', 'JavaScript', 'React'];

const BackendSection = () => {
  return (
    <Section title="Backend Technologies" items={frontendLanguages} />
  )
}

export default BackendSection;