import acodeData from '@common/services/acodeData';

import access_html_file from "@assets/images/html_images/access_html_file.jpg";

import creact_file_html from "@assets/images/html_images/creact_file_html.jpg";

import Show_htmkpage from "@assets/images/html_images/Show_htmkpage.jpg";

import writting_code from "@assets/images/html_images/writting_code.jpg";


const anotherArray = [
  {src: creact_file_html },
  {src: access_html_file },
  {src: writting_code},
  {src :Show_htmkpage}
];



const jsData = [[...acodeData,...anotherArray]];

export default jsData;


//const mergedArray = [...acodeData, ...anotherArray];



