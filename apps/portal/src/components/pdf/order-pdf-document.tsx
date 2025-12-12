import React from "react";

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { Order } from "@/types/order-type";

// 3x2 inch = 216x144 points (72 points per inch)
const PAGE_WIDTH = 216;
const PAGE_HEIGHT = 144;

const styles = StyleSheet.create({
    page: {
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        gap: 4,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    headerLeft: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },
    logoContainer: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    logo: {
        width: 40,
        height: 40,
        objectFit: "contain",
    },
    consignmentIdTitle: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "left",
    },
    value: {
        fontSize: 9,
        fontWeight: "600",
        textAlign: "left",
    },
    shopName: {
        fontSize: 9,
        fontWeight: "600",
        textAlign: "left",
    },
    productSection: {
        width: "100%",
        marginTop: 4,
        paddingTop: 4,
        borderTop: "1 solid #000",
        display: "flex",
        gap: 2,
    },
    productItem: {
        fontSize: 8,
        textAlign: "left",
        lineHeight: 1.2,
    },
});

interface OrderPDFDocumentProps {
    orders: Order[];
    shopLogo?: string;
    merchantId?: string;
    shopName?: string;
}

export const OrderPDFDocument = ({ orders, shopLogo, merchantId, shopName }: OrderPDFDocumentProps) => {
    return (
        <Document>
            {orders.map((order) => (
                <Page key={order.id} size={[PAGE_WIDTH, PAGE_HEIGHT]} style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {shopName && <Text style={styles.shopName}>{shopName}</Text>}
                            {merchantId && <Text style={styles.value}>{merchantId}</Text>}
                            {order.consignmentId && (
                                <Text style={styles.consignmentIdTitle}>{order.consignmentId}</Text>
                            )}
                        </View>
                        {shopLogo && (
                            <View style={styles.logoContainer}>
                                <Image src={shopLogo} style={styles.logo} />
                            </View>
                        )}
                    </View>

                    {/* Products */}
                    {order.orderItems && order.orderItems.length > 0 && (
                        <View style={styles.productSection}>
                            {order.orderItems.map((item, index) => {
                                const variantName =
                                    item.orderItemVariant && item.orderItemVariant.length > 0
                                        ? item.orderItemVariant
                                              .map((v) => v.productVariantOption?.name)
                                              .filter(Boolean)
                                              .join(", ")
                                        : null;

                                return (
                                    <Text key={item.id} style={styles.productItem}>
                                        {index + 1}. {item.product.name} {variantName ? `- ${variantName}` : ""} -{" "}
                                        {item.quantity}
                                    </Text>
                                );
                            })}
                        </View>
                    )}
                </Page>
            ))}
        </Document>
    );
};
