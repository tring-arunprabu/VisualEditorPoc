// src/components/Post.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERYResult } from "../../sanity.types";
import ReactPlayer from "react-player";

export function Post({ post }: { post: any }) {
  const { title, mainImage, body, categories, heroSection, banner } =
    post || {};
  return (
    <main>
      {title ? <h1>{title}</h1> : null}
      {mainImage?.asset?._ref ? (
        <Image
          className="float-left m-0 w-1/3 mr-4 rounded-lg"
          src={urlFor(mainImage?.asset?._ref).width(300).height(300).url()}
          width={300}
          height={300}
          alt={title || ""}
        />
      ) : null}
      {body ? <PortableText value={body} /> : null}
      {categories?.length
        ? categories.map((item: any) => <h1>{item?.title}</h1>)
        : null}
      {banner && banner?.bannerType !== "none" ? (
        <h1>{banner?.caption}</h1>
      ) : null}
      {banner?.bannerType === "image" && banner?.image?.asset?._ref ? (
        <Image
          className="float-left m-0 w-1/3 mr-4 rounded-lg"
          src={urlFor(banner?.image?.asset?._ref).width(300).height(300).url()}
          width={300}
          height={300}
          alt={title || ""}
        />
      ) : null}
      {banner?.bannerType === "video" && banner?.video ? (
        <ReactPlayer url={banner?.video} />
      ) : null}
      <hr />
      <Link href="/">&larr; Return home</Link>
    </main>
  );
}
