/**
 * 存放枚举变量
 */

/**
 * 课程类型枚举
  */
export const courseType = [
  { label: '专业必修课', value: '1' },
  { label: '公共必修课', value: '2' },
  { label: '专业选修课', value: '3' },
  { label: '公共选修课', value: '4' },
  { label: '通识课', value: '5' }
]


/**
 * 题目类型枚举
 */
export const questionType = [
  { label: '单选题', value: '1' },
  { label: '填空题', value: '2' },
  { label: '判断题', value: '3' },
  { label: '简答题', value: '4' },
  { label: '主观题', value: '5' },
  { label: '多选题', value: '6' },
]

/**
 * 作业类型枚举
 */
export const examType = [
  { label: '作业', value: '1' },
  { label: '考试', value: '2' }
]

// 获取文件类型，展示不同的图标
export function getFileTypeFromMIME (mimeType) {
  switch (mimeType) {
    case 'application/illustrator': // .ai文件
      return 'AI.svg';
    case 'application/vnd.ms-excel': // Excel文件
      return 'excel.svg';
    case 'image/gif': // GIF文件
      return 'GIF.svg';
    case 'text/html': // HTML文件
      return 'HTML.svg';
    case 'image/jpeg': // JPG文件
    case 'image/png':
      return 'tupian.svg';
    case 'application/pdf': // PDF文件
      return 'PDF';
    case 'application/vnd.ms-powerpoint': // PPT文件
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'PPT.svg';
    case 'image/vnd.adobe.photoshop': // PSD文件
      return 'PSD.svg';
    case 'video/mp4': // 视频文件
      return 'shipin.svg';
    case 'image/svg+xml': // SVG文件
      return 'SVG.svg';
    case 'text/plain': // TXT文件
      return 'txt.svg';
    case 'application/msword': // Word文档
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'word.svg';
    case 'application/zip': // 压缩包
      return 'yasuo.svg';
    case 'audio/mpeg': // 音频文件
      return 'yinpin.svg';
    case 'application/octet-stream': // EXE
    case 'application/x-msdos-program':
    case 'application/x-msdownload':
      return 'EXE.svg'
    default:
      return 'weizhiwenjian.svg';
  }
}
// 获取文件大小包括单位
export function formatBytes (bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
