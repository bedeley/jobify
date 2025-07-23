import { getSingleJobAction } from "@/utils/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import EditJobForm from "@/components/EditJobForm";

type Params = Promise<{id: string}>

const JobDetailPage = async ({ params }: { params: Params}) => {
  const queryClient = new QueryClient();
  const {id} = await params

  queryClient.prefetchQuery({
    queryKey: ["job", id],
    queryFn: () => getSingleJobAction({id: id}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={id} />
    </HydrationBoundary>
  );
};
export default JobDetailPage;
