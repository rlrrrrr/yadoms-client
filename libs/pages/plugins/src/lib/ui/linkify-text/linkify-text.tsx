import { Anchor } from '@mantine/core';
import React from 'react';

export interface LinkifyTextProps {
  text?: string;
}

export function LinkifyText(props: LinkifyTextProps) {
  if (props.text === undefined) {
    return null;
  }

  const regex = /\[(.*?)]\((.*?)\)/g;
  const parts: (string | JSX.Element)[] = [];

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(props.text))) {
    const [fullMatch, title, url] = match;
    const index = match.index;

    if (index > lastIndex) {
      parts.push(props.text.substring(lastIndex, index));
    }

    parts.push(
      <Anchor key={index} href={url} target="_blank" underline="hover" fz="xs">
        {title}
      </Anchor>
    );

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < props.text.length) {
    parts.push(props.text.substring(lastIndex));
  }

  return <>{parts}</>;
}

export default LinkifyText;
