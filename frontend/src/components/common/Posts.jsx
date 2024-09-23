import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useQuery} from "@tanstack/react-query"
import React from "react";

const Posts = ({feedType,userName,userId}) => {

	const getApiEndPoint = () =>
	{
		switch(feedType){
			case "forYou":
				return "/api/post/all";
			case "following":
				return "/api/post/following";
			case "likes":
				return `/api/post/likes/${userId}`;
			case "posts":
				return `/api/post/user/${userName}`
			default:
				return "/api/post/all"
		}
	}

	const POST_ENDPOINT = getApiEndPoint()

	const {data : posts,isLoading, refetch , isRefetching} = useQuery(
		{
			queryKey:['posts'],
			queryFn:async()=>
			{
				try {
					const res = await fetch(POST_ENDPOINT);
					const data = await res.json();

					if(!res.ok)
						throw new Error(data.error || "Something went wrong")

					return data
				} catch (error) {
					throw new Error(error)
				}
			},

		}
	)

React.useEffect(()=>{
	refetch()
},[feedType,refetch,userName])
	return (
		<>
			{isLoading  && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;