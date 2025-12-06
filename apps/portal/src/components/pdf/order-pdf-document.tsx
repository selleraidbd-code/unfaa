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
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
    },
    logoContainer: {
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 40,
        height: 40,
        objectFit: "contain",
    },
    value: {
        fontSize: 8,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    consignmentIdTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    section: {
        width: "100%",
        marginBottom: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    productSection: {
        width: "100%",
        marginTop: 2,
        paddingTop: 2,
    },
    productItem: {
        fontSize: 7,
        marginBottom: 2,
        textAlign: "center",
        lineHeight: 1.2,
    },
});

interface OrderPDFDocumentProps {
    orders: Order[];
    shopLogo?: string;
    merchantId?: string;
}

export const OrderPDFDocument = ({ orders, shopLogo, merchantId }: OrderPDFDocumentProps) => {
    return (
        <Document>
            {orders.map((order) => (
                <Page key={order.id} size={[PAGE_WIDTH, PAGE_HEIGHT]} style={styles.page}>
                    {/* Shop Logo */}
                    {shopLogo && (
                        <View style={styles.logoContainer}>
                            <Image src={shopLogo} style={styles.logo} cache={false} />
                        </View>
                    )}

                    {/* Consignment ID - Value Only */}
                    {order.consignmentId && (
                        <View style={styles.section}>
                            <Text style={styles.consignmentIdTitle}>{order.consignmentId}</Text>
                        </View>
                    )}

                    {/* Merchant ID - Value Only */}
                    {merchantId && (
                        <View style={styles.section}>
                            <Text style={styles.value}>{merchantId}</Text>
                        </View>
                    )}

                    {/* Products */}
                    {order.orderItems && order.orderItems.length > 0 && (
                        <View style={styles.productSection}>
                            {order.orderItems.map((item) => {
                                const variantName =
                                    item.orderItemVariant && item.orderItemVariant.length > 0
                                        ? item.orderItemVariant[0]?.name
                                        : null;
                                return (
                                    <Text key={item.id} style={styles.productItem}>
                                        {item.product.name} {variantName ? `- ${variantName}` : ""} - {item.quantity}
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
