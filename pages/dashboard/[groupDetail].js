import { useRouter } from 'next/router';
import GroupContainer from '../../components/groups/GroupContainer';
import Layout from '../../components/layout/Layout';

export default function GroupDetail() {
  const router = useRouter();
  const path = router.query.groupDetail;

  return (
    <Layout>
      <GroupContainer />
    </Layout>
  );
}
