// @ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";

interface IMetaTags {
  title?: string;
  description?: string;
}

type Props = IMetaTags;

const MetaTags: React.FC<Props> = (props: Props) => {
  const { title, description } = props;
  const commonTitle = "Homzhub";
  const commonDescription = "Property Custodian";
  return (
    <div>
      <Helmet>
        {/* Title is 69 char limit */}
        {/* Decription is 160 chars limit */}

        {title !== null && title !== undefined ? (
          <title>{title}</title>
        ) : (
          <title>{commonTitle}</title>
        )}

        <meta
          name="title"
          content={
            title !== null && title !== undefined
              ? `${title}`
              : `${commonTitle}`
          }
        />
        <meta
          name="description"
          content={
            description !== null && description !== undefined
              ? `${description}`
              : `${commonDescription}`
          }
        />
      </Helmet>
    </div>
  );
};

export default MetaTags;
