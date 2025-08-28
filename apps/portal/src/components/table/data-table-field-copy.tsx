import React from "react";

import type { Row } from "@tanstack/react-table";
import { CheckCheck, Copy } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";

export const DataTableFieldCopy = <T,>({
  row,
  field,
}: {
  row: Row<T>;
  field: string;
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(row.getValue(field));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline">{row.getValue(field)}</Badge>
      <button
        onClick={handleCopy}
        className="rounded p-1 hover:bg-muted cursor-pointer"
      >
        {copied ? (
          <CheckCheck className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </div>
  );
};
