import ProgramDownload from './ProgramDownload';

const acodeProgram = 'https://play.google.com/store/apps/details?id=com.foxdebug.acode'; // رابط صفحة Acode في Google play

const ProgramDownloadButton = ({program}) => {
    switch (program) {
      case 'acode':
        return <ProgramDownload storeUrl ={acodeProgram} />;
      case 'files':
        return <p>Files section is selected.</p>;
      case 'acode':
        return <p>Acode application is selected.</p>;
      default:
        return <p>No application selected.</p>;
    }
  };

export default ProgramDownloadButton;