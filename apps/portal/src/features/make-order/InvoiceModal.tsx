//595 x 842
import { DownloadIcon } from "lucide-react";
import { Margin, usePDF } from "react-to-pdf";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface InvoiceModalProps {
  receiptDialogOpen: boolean;
  setReceiptDialogOpen: (open: boolean) => void;
  orderNumber: string;
}

export const InvoiceModal = ({
  receiptDialogOpen,
  setReceiptDialogOpen,
  orderNumber,
}: InvoiceModalProps) => {
  const { toPDF, targetRef } = usePDF({
    filename: "use-pdf-example.pdf",
    page: { margin: Margin.MEDIUM, orientation: "portrait" },
  });

  return (
    <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-2xl font-bold">Invoice</DialogTitle>
          <button
            onClick={() => toPDF()}
            className="mx-auto flex w-fit cursor-pointer items-center gap-2 rounded-md border bg-sky-50 p-2 hover:bg-sky-100"
          >
            Download PDF <DownloadIcon className="h-4 w-4" />
          </button>
          <DialogDescription className="text-muted-foreground text-sm">
            Invoice for order {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={targetRef}
          className="mx-auto w-[595px] bg-[#ffffff] font-sans text-[#0A1D5C]"
        >
          {/* Header */}
          <div className="relative">
            <div className="h-[200px] overflow-hidden rounded-b-[60px] bg-[#0A1D5C]">
              <div className="absolute top-0 left-0 z-10 h-[200px] w-[300px] rounded-br-[150px] bg-[#00ADEE]" />

              <div className="absolute top-6 left-8 z-20 flex items-center space-x-3">
                <div className="rounded-md bg-[#ffffff] px-3 py-2">
                  <h1 className="text-xl font-bold text-[#0A1D5C]">MK</h1>
                  <p className="text-sm text-[#0A1D5C]">Electricals</p>
                </div>
              </div>

              <div className="absolute top-6 right-8 z-20 space-y-1 text-sm text-[#ffffff]">
                <p>📞 +88 01755 959448</p>
                <p>📧 marufbapary13@gmail.com</p>
                <p>
                  📍 Ebrahim Electric Market-124, BCC Road, Nawabpur Dhaka-1100,
                  Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Ref and Date */}
          <div className="flex justify-between px-12 py-4 text-sm italic">
            <p>Ref:</p>
            <p>Date: .......................................</p>
          </div>

          {/* Content area with watermark */}
          <div className="relative min-h-[700px] px-12">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-bold text-[#0A1D5C] opacity-10 select-none">
              MK
              <br />
              Electricals
            </div>
            {/* Content can be placed here */}
          </div>

          {/* Footer */}
          <div className="flex h-[80px] items-center justify-center">
            <div className="flex w-full items-center justify-center gap-10 bg-gradient-to-r from-[#0A1D5C] via-[#0A1D5C] to-[#00ADEE] py-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Schneider_Electric_logo.svg/2560px-Schneider_Electric_logo.svg.png"
                alt="Schneider"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/ABB_logo.svg/2560px-ABB_logo.svg.png"
                alt="ABB"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Siemens-logo.svg/2560px-Siemens-logo.svg.png"
                alt="Siemens"
                className="h-6"
              />
            </div>
          </div>
        </div>

        {/* <div ref={targetRef} className="flex flex-col gap-6 rounded-lg border bg-[#84c2f2] p-4">
                    <div className="flex items-start justify-between border-b pb-4">
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold">MK</div>
                            <div className="font-semibold">Electricals</div>
                        </div>
                        <div className="flex max-w-[50%] flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="">📞</span>
                                <span>+88 01755 959448</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="">✉️</span>
                                <span>marufkparty1@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="">📍</span>
                                <span>Ebrahim Electric Market-124, ISCC Road, Nawabpur Dhaka-1100</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <p className="">Ref:</p>
                            <p>{orderNumber}</p>
                        </div>
                        <div>
                            <p className="">Date:</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="">
                                <tr>
                                    <th className="p-2 text-left">Item</th>
                                    <th className="p-2 text-right">Qty</th>
                                    <th className="p-2 text-right">Price</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-2">Sample Product</td>
                                    <td className="p-2 text-right">1</td>
                                    <td className="p-2 text-right">$100.00</td>
                                    <td className="p-2 text-right">$100.00</td>
                                </tr>
                            </tbody>
                            <tfoot className="">
                                <tr className="border-t">
                                    <td colSpan={3} className="p-2 text-right font-medium">
                                        Total:
                                    </td>
                                    <td className="p-2 text-right font-bold">$100.00</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="mt-auto flex items-center justify-center gap-6 border-t pt-4">
                        <span className="text-xs">Authorized Partners:</span>
                        <span className="text-sm font-medium">Schneider Electric</span>
                        <span className="text-sm font-medium">ABB</span>
                        <span className="text-sm font-medium">SIEMENS</span>
                    </div>
                </div> */}
      </DialogContent>
    </Dialog>
  );
};
