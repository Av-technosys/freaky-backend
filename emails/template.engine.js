import fs from 'fs';
import path from 'path';

export const loadTemplate = (templatePath, data) => {
  let html = fs.readFileSync(templatePath, 'utf-8');

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');

    html = html.replace(regex, data[key]);
  });

  return html;
};
