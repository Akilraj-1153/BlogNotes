import React from "react";
import { ExternalLink } from "react-external-link";

const Img = ({ url, caption }) => {
  return (
    <div className="w-full">
      <img className="aspect-video w-full object-cover  rounded-lg" src={url} alt={caption} />
      {caption.length > 0 && <p className="mt-1 text-center">{caption}</p>}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="border-l-2 border-black p-2 pl-2">
      <p dangerouslySetInnerHTML={{ __html: quote }}></p>
      {caption.length > 0 && <p className="mt-1 w-full font-bold">{caption}</p>}
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <div className=" pl-10">
      <ol className={style === "ordered" ? "list-decimal" : "list-disc"}>
        {items.map((item, i) => (
          <li
            key={i}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: item }}
          ></li>
        ))}
      </ol>
    </div>
  );
};

function BlogContent({ block }) {
  const { type, data } = block;

  if (type === "paragraph") {
    return (
      <p
        className="w-full break-word"
        dangerouslySetInnerHTML={{
          __html: data.text.replace(
            /<a\s+href="([^"]+)"([^>]*)>([^<]+)<\/a>/gi,
            '<a href="$1" class="text-blue-700 underline break-word">$3</a>'
          ),
        }}
      ></p>
    );
  }

  if (type === "header") {
    const headerLevels = [
      "text-4xl",
      "text-3xl",
      "text-2xl",
      "text-xl",
      "text-lg",
      "text-base",
    ];
    const level = data.level - 1;
    const headerClass = `font-bold ${headerLevels[level]}`;

    return (
      <h2
        className={headerClass}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }

  if (type === "code") {
    return <code>
      <pre className="bg-black/50 w-full text-wrap text-sm rounded-lg p-2">{data.code}</pre>
      </code>
  }

  if (type === "link") {
    return (
      <ExternalLink href={data.link} className="underline text-blue-700 p-2">
        {data.link}
      </ExternalLink>
    );
  }
}

export default BlogContent;
