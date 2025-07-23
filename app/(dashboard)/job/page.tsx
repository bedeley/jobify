import JobList from "@/components/JobList";
import SearchForm from "@/components/SearchForm";
import { getAllJobsAction } from "@/utils/actions";
import {
  dehydrate,
  // hydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const JobPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all", 1],
    queryFn: () => getAllJobsAction({}),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <JobList/>
    </HydrationBoundary>
  );
};
export default JobPage;
