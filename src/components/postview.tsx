
import Link from "next/link";
import Image from "next/image"
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
dayjs.extend(relativeTime);
export const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div key={post.id} className="flex gap-3 border-b border-opacity-20 border-white p-4">
      <Image 
        alt={`@${author.username ?? 'user'}'s profile picture`}
        width={56} 
        height={56} 
        src={author.profileImageUrl} 
        className="h-12 w-12 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400"> 
          <Link href={`/@${author.username ?? 'user'}`}>
            <span>{`@${author.username ?? 'user'}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{
          post.content
        }</span>
      </div>
    </div>
  )
}