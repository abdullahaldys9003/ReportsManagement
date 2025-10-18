import { faHtml5, faCss3, faJsSquare, faBootstrap, faReact, faVuejs, faNodeJs, faPhp, faLaravel, faPython } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StorageIcon from '@mui/icons-material/Storage'; // أيقونة MySQL
import CodeIcon from '@mui/icons-material/Code'; // أيقونة Express

const ICONS = {
  html: <FontAwesomeIcon icon={faHtml5} size="1x" style={{ color: 'red' }} />,
  css: <FontAwesomeIcon icon={faCss3} size="1x" style={{ color: '#264de4' }} />,
  javascript: <FontAwesomeIcon icon={faJsSquare} size="1x" style={{ color: '#F7DF1E' }} />,
  bootstrap: <FontAwesomeIcon icon={faBootstrap} size="1x" style={{ color: '#563d7c' }} />,
  react: <FontAwesomeIcon icon={faReact} size="1x" style={{ color: '#61DBFB' }} />,
  vue: <FontAwesomeIcon icon={faVuejs} size="1x" style={{ color: '#42b883' }} />,
  node: <FontAwesomeIcon icon={faNodeJs} size="1x" style={{ color: '#3C873A' }} />,
  php: <FontAwesomeIcon icon={faPhp} size="1x" style={{ color: '#777BB3' }} />,
  mysql: <StorageIcon style={{ color: '#00758F' }} />,
  express: <CodeIcon style={{ color: '#000000' }} />,
  python: <FontAwesomeIcon icon={faPython} size="1x" style={{ color: '#306998' }} />,
  laravel: <FontAwesomeIcon icon={faLaravel} size="1x" style={{ color: '#FF2D20' }} />,
};

const IconSwitcher = ({ language }) => {
  return ICONS[language] || null; // إرجاع الأيقونة المناسبة أو null إذا لم توجد
};

export default IconSwitcher;

