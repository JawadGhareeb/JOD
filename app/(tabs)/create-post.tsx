import { CreatePostScreen } from "@/src/components/pages/create-post";

// Registered under (tabs) but `href: null` in the tab layout — it is only ever
// pushed onto the stack, so it needs its own title + back arrow like any other
// pushed screen (e.g. groups/create).
export default function CreatePostPage() {
  return <CreatePostScreen />;
}
