import Layout from '../../components/layout/Layout';
import MatchDetail from '../../components/match-listing/MatchDetail';

export default function CreateMatch() {
  return (
    <>
      <Layout>
        <div className='details-wrapper'>
          <h1>Create Match</h1>
          <MatchDetail />
        </div>
      </Layout>
    </>
  );
}
