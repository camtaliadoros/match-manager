export const getImageExtension = (imagePath) => {
  const startIndex = imagePath.indexOf('/');
  const endIndex = imagePath.indexOf(';');
  const imgType = imagePath.slice(startIndex + 1, endIndex);
  return imgType;
};
