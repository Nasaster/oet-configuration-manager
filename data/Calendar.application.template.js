module.exports = {
    "config": {
        "stylePack": "String",
        "selectedLocale": "String",
        "marketingAdvertisementImageHome": "String",
        "marketingAdvertisementImageCustomer": "String",
        "marketingAdvertisementImageOrder": "String",
        "photoQualityRating": [ "Number" ],
        "maxPhotoPixels": "Number",
        "subscribeToNewsletterDefault": "Boolean",
        "homeUrl": "String",
        "shippingUrl": "String",
        "customerServiceUrl": "String",
        "productPreviewThumbnailWidth": "Number",
        "includePreviewWithCheckout": "Boolean",
        "saveLoadEnabled": "Boolean",
        "saveNameInputMaxLength": "Number",
        "enableLivePreviewInNavigation": "Boolean",
        "enableWelcomePopup": "Boolean",
        "staticCalendarGridPreview": "Boolean",
        "defaultUploadTimeout": [ "Number" ],
        "maxUploadRetries": "Number",
        "minimumPhotoAmountForValidation": "Number",
        "previewIncludingMargins": {
            "canvas": "Boolean"
        },
        "previewTransparent": {
            "phonecase": "Boolean",
            "calendar": "Boolean"
        },
        "previewTypes": {
            "roomView": [ "String" ]
        },
        "allowProductPreview": "Boolean",
        "disableMobileView": "Boolean"
    },
    "currency": {
        "code": "String",
        "format": "String",
        "priceFormat": "String"
    },
    "calendar": {
        "allowedEventTypes": [ "String" ],
        "deluxeTypes": [ "String" ],
        "allowStartDate": "Boolean",
        "dateFormat": {
            "recurring": "String",
            "unique": "String"
        },
        "overrideCultureName": "Boolean"
    },
    "tabs": {
        "months": {
            "disabled": [ "String" ]
        },
        "photos": {
            "disabled": [ "String" ]
        },
        "layouts": {
            "disabled": [ "String" ]
        },
        "spacing": {
            "disabled": [ "String" ]
        },
        "backgrounds": {
            "disabled": [ "String" ]
        },
        "tooltray": {
            "disabled": [ "String" ]
        },
        "product-options": {
            "disabled": [ "String" ]
        }
    },
    "productList": {
        "dateFormat": "String",
        "showModifiedDate": "Boolean"
    },
    "country": {
        "label": "String",
        "data": "String",
        "zoneid": "String",
        "zipCodeExample": "String",
        "zipCodeExpression": "String"
    },
    "layout": {
        "spacing": {
            "enabled": "Boolean",
            "inner": {
                "metric": "mm",
                "precision": "Number",
                "acceleration": "Number",
                "minValue": "Number",
                "maxValue": "Number",
                "comment": "String",
                "excludes": [ "String" ]
            },
            "outer": {
               "metric": "String",
                "precision": "Number",
                "acceleration": "Number",
                "minValue": "Number",
                "maxValue": "Number",
                "comment": "String",
                "excludes": [ "String" ]
            }
        }
    },
    "highlightStroke": {
        "supportedArticleTypes": [ "String" ]
    },
    "backgroundColors": {
        "color": [ "String" ]
    }
};
