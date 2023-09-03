import ContentLoader from 'react-content-loader';

export const Skeleton = () => (
  <ContentLoader
    speed={2}
    width={320}
    height={518}
    viewBox='0 0 320 518'
    backgroundColor='#f2f2f2'
    foregroundColor='#ecebeb'
  >
    <rect x='0' y='0' rx='30' ry='30' width='320' height='350' />
    <rect x='1' y='320' rx='0' ry='0' width='320' height='124' />
    <rect x='1' y='420' rx='30' ry='30' width='320' height='72' />
  </ContentLoader>
);
