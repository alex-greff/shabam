import React, { FunctionComponent, useEffect, useState } from "react";
import "./CoverArtImage.scss";
import classnames from "classnames";
import { BaseProps } from "@/types";

import ImageIcon from "@material-ui/icons/Image";

export interface Props extends BaseProps {
  src?: Blob;
  alt?: string;
}

const CoverArtImage: FunctionComponent<Props> = (props) => {
  const { className, style, id, src, alt, ...rest } = props;

  const [srcFile, setSrcFile] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (src) {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => {
        const file = reader.result;
        setSrcFile(file);
      });
      reader.readAsDataURL(src);
    }
  }, [src]);

  return (
    <div
      className={classnames("CoverArtImage", props.className)}
      style={props.style}
      id={props.id}
    >
      {srcFile ? (
        <img {...rest} className="CoverArtImage__image" alt={alt} src={srcFile as any} />
      ) : (
        <div className="CoverArtImage__no-image">
          <ImageIcon className="CoverArtImage__no-image-icon" />
        </div>
      )}
    </div>
  );
};

CoverArtImage.defaultProps = {} as Partial<Props>;

export default CoverArtImage;
