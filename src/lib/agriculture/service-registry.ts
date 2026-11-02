export const agricultureServiceRegistry = [
  {
    "slug": "crop-farming",
    "titleBn": "ফসল উৎপাদন ও চাষাবাদ",
    "titleEn": "Crop Farming",
    "category": "কৃষি",
    "descriptionBn": "ফসলের নাম, জমির পরিমাণ, চাষের পর্যায় ও মৌসুম জানিয়ে চাষ পরিকল্পনা বা মাঠপর্যায়ের কৃষি পরামর্শ চান।",
    "descriptionEn": "Request crop planning or field-level farming advice by sharing the crop, land area, growth stage, and season.",
    "icon": "🌾",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "চাষাবাদ-সংক্রান্ত তথ্য",
    "sectionEn": "Crop Farming details",
    "fields": [
      {
        "name": "crop_name",
        "labelBn": "ফসলের নাম",
        "labelEn": "Crop Name",
        "type": "text",
        "required": false
      },
      {
        "name": "land_area",
        "labelBn": "জমির পরিমাণ",
        "labelEn": "Land Area",
        "type": "text",
        "required": false
      },
      {
        "name": "crop_stage",
        "labelBn": "চাষের বর্তমান পর্যায়",
        "labelEn": "Crop Stage",
        "type": "text",
        "required": false
      },
      {
        "name": "planting_period",
        "labelBn": "চাষের সময়/মৌসুম",
        "labelEn": "Planting Period",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "seeds-seedlings",
    "titleBn": "বীজ ও চারা",
    "titleEn": "Seeds & Seedlings",
    "category": "কৃষি",
    "descriptionBn": "বীজ বা চারার ধরন, জাত, পরিমাণ ও প্রয়োজনের সময় জানিয়ে উপযুক্ত উৎস বা সরবরাহকারী খুঁজুন।",
    "descriptionEn": "Find suitable seed or seedling sources by specifying the type, variety, quantity, and when you need them.",
    "icon": "🌱",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "বীজ ও চারা-সংক্রান্ত তথ্য",
    "sectionEn": "Seeds & Seedlings details",
    "fields": [
      {
        "name": "seed_kind",
        "labelBn": "যা প্রয়োজন",
        "labelEn": "Seed Kind",
        "type": "select",
        "options": [
          {
            "value": "বীজ",
            "labelBn": "বীজ",
            "labelEn": "Seeds"
          },
          {
            "value": "চারা",
            "labelBn": "চারা",
            "labelEn": "Seedlings"
          },
          {
            "value": "বীজ ও চারা",
            "labelBn": "বীজ ও চারা",
            "labelEn": "Seeds and seedlings"
          }
        ],
        "required": false
      },
      {
        "name": "seed_variety",
        "labelBn": "ফসল/জাতের নাম",
        "labelEn": "Seed Variety",
        "type": "text",
        "required": false
      },
      {
        "name": "seed_quantity",
        "labelBn": "পরিমাণ ও একক",
        "labelEn": "Seed Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "seed_needed_by",
        "labelBn": "কখন প্রয়োজন",
        "labelEn": "Seed Needed By",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "fertilizer-soil",
    "titleBn": "সার ও মাটি পরীক্ষা",
    "titleEn": "Fertilizer & Soil Testing",
    "category": "কৃষি",
    "descriptionBn": "ফসল, জমির পরিমাণ ও মাটির পরীক্ষার অবস্থা জানিয়ে সার ব্যবস্থাপনা বা মাটি পরীক্ষা-সংক্রান্ত পরামর্শ চান।",
    "descriptionEn": "Fertilizers, soil health, testing and qualified advisors.",
    "icon": "🧪",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "সার ও মাটি পরীক্ষা-সংক্রান্ত তথ্য",
    "sectionEn": "Fertilizer & Soil Testing details",
    "fields": [
      {
        "name": "soil_crop",
        "labelBn": "ফসলের নাম",
        "labelEn": "Soil Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "soil_land_area",
        "labelBn": "জমির পরিমাণ",
        "labelEn": "Soil Land Area",
        "type": "text",
        "required": false
      },
      {
        "name": "soil_test_status",
        "labelBn": "মাটি পরীক্ষা",
        "labelEn": "Soil Test Status",
        "type": "select",
        "options": [
          {
            "value": "এখনও করাইনি",
            "labelBn": "এখনও করাইনি",
            "labelEn": "Not tested yet"
          },
          {
            "value": "পরীক্ষা করিয়েছি",
            "labelBn": "পরীক্ষা করিয়েছি",
            "labelEn": "Tested"
          },
          {
            "value": "পরীক্ষা করাতে চাই",
            "labelBn": "পরীক্ষা করাতে চাই",
            "labelEn": "Request a test"
          }
        ],
        "required": false
      },
      {
        "name": "soil_need",
        "labelBn": "কী ধরনের সহায়তা প্রয়োজন",
        "labelEn": "Soil Need",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "pest-control",
    "titleBn": "বালাই ও রোগ ব্যবস্থাপনা",
    "titleEn": "Pest & Disease Management",
    "category": "কৃষি",
    "descriptionBn": "ফসলের লক্ষণ, আক্রান্ত এলাকা ও সমস্যার সময়কাল জানিয়ে রোগবালাই শনাক্তকরণ ও নিরাপদ ব্যবস্থাপনা পরামর্শ চান।",
    "descriptionEn": "Request pest or disease identification and safe management advice by sharing crop symptoms, affected area, and how long the issue has been present.",
    "icon": "🛡️",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "রোগবালাই-সংক্রান্ত তথ্য",
    "sectionEn": "Pest & Disease Management details",
    "fields": [
      {
        "name": "affected_crop",
        "labelBn": "আক্রান্ত ফসল",
        "labelEn": "Affected Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "affected_area",
        "labelBn": "আক্রান্ত জমির পরিমাণ",
        "labelEn": "Affected Area",
        "type": "text",
        "required": false
      },
      {
        "name": "symptom_duration",
        "labelBn": "সমস্যা কতদিন ধরে",
        "labelEn": "Symptom Duration",
        "type": "text",
        "required": false
      },
      {
        "name": "crop_symptoms",
        "labelBn": "দেখা লক্ষণ",
        "labelEn": "Crop Symptoms",
        "type": "text",
        "required": false
      },
      {
        "name": "disease_photo",
        "labelBn": "রোগাক্রান্ত ফসলের ছবি",
        "labelEn": "Disease Photo",
        "type": "file",
        "required": false
      }
    ]
  },
  {
    "slug": "irrigation",
    "titleBn": "সেচ ও পানি ব্যবস্থাপনা",
    "titleEn": "Irrigation & Water",
    "category": "কৃষি",
    "descriptionBn": "ফসল, জমির পরিমাণ, পানির উৎস ও সেচের সময় জানিয়ে সেচযন্ত্র বা পানি ব্যবস্থাপনার সহায়তা চান।",
    "descriptionEn": "Find irrigation equipment, pumps, water and irrigation services.",
    "icon": "💧",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "সেচ-সংক্রান্ত তথ্য",
    "sectionEn": "Irrigation & Water details",
    "fields": [
      {
        "name": "irrigation_crop",
        "labelBn": "ফসলের নাম",
        "labelEn": "Irrigation Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "irrigation_area",
        "labelBn": "সেচের জমির পরিমাণ",
        "labelEn": "Irrigation Area",
        "type": "text",
        "required": false
      },
      {
        "name": "water_source",
        "labelBn": "পানির উৎস",
        "labelEn": "Water Source",
        "type": "select",
        "options": [
          {
            "value": "নলকূপ",
            "labelBn": "নলকূপ",
            "labelEn": "Tube well"
          },
          {
            "value": "পুকুর/খাল",
            "labelBn": "পুকুর/খাল",
            "labelEn": "Pond/canal"
          },
          {
            "value": "নদী",
            "labelBn": "নদী",
            "labelEn": "River"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "irrigation_time",
        "labelBn": "কখন সেচ প্রয়োজন",
        "labelEn": "Irrigation Time",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "farm-machinery",
    "titleBn": "কৃষিযন্ত্র ভাড়া ও মেরামত",
    "titleEn": "Farm Machinery",
    "category": "কৃষি",
    "descriptionBn": "প্রয়োজনীয় যন্ত্র, কাজের ধরন, জমির পরিমাণ ও সময় জানিয়ে কৃষিযন্ত্র ভাড়া বা মেরামতের অনুরোধ দিন।",
    "descriptionEn": "Rent and repair tractors, power tillers and harvesters.",
    "icon": "🚜",
    "categoryId": "labor-machinery",
    "formVersion": 1,
    "sectionBn": "কৃষিযন্ত্র-সংক্রান্ত তথ্য",
    "sectionEn": "Farm Machinery details",
    "fields": [
      {
        "name": "machine_type",
        "labelBn": "প্রয়োজনীয় যন্ত্র",
        "labelEn": "Machine Type",
        "type": "select",
        "options": [
          {
            "value": "ট্রাক্টর",
            "labelBn": "ট্রাক্টর",
            "labelEn": "Tractor"
          },
          {
            "value": "পাওয়ার টিলার",
            "labelBn": "পাওয়ার টিলার",
            "labelEn": "Power tiller"
          },
          {
            "value": "হারভেস্টার",
            "labelBn": "হারভেস্টার",
            "labelEn": "Harvester"
          },
          {
            "value": "স্প্রেয়ার",
            "labelBn": "স্প্রেয়ার",
            "labelEn": "Sprayer"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "machine_service",
        "labelBn": "কাজের ধরন",
        "labelEn": "Machine Service",
        "type": "select",
        "options": [
          {
            "value": "ভাড়া",
            "labelBn": "ভাড়া",
            "labelEn": "Hire"
          },
          {
            "value": "মেরামত",
            "labelBn": "মেরামত",
            "labelEn": "Repair"
          },
          {
            "value": "অন্য সেবা",
            "labelBn": "অন্য সেবা",
            "labelEn": "Other service"
          }
        ],
        "required": false
      },
      {
        "name": "machine_area",
        "labelBn": "কাজের এলাকা/জমির পরিমাণ",
        "labelEn": "Machine Area",
        "type": "text",
        "required": false
      },
      {
        "name": "machine_date",
        "labelBn": "কখন প্রয়োজন",
        "labelEn": "Machine Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "farm-labour",
    "titleBn": "কৃষিশ্রমিক বুকিং",
    "titleEn": "Farm Labour Booking",
    "category": "শ্রম",
    "descriptionBn": "কাজের ধরন, শ্রমিকের সংখ্যা, কাজের সময়কাল ও তারিখ জানিয়ে কৃষিশ্রমিক বুকিংয়ের অনুরোধ দিন।",
    "descriptionEn": "Book workers for planting, weeding, harvesting and seasonal work.",
    "icon": "👩‍🌾",
    "categoryId": "labor-machinery",
    "formVersion": 1,
    "sectionBn": "কৃষিশ্রমিক বুকিং-সংক্রান্ত তথ্য",
    "sectionEn": "Farm Labour Booking details",
    "fields": [
      {
        "name": "labour_task",
        "labelBn": "কাজের ধরন",
        "labelEn": "Labour Task",
        "type": "select",
        "options": [
          {
            "value": "রোপণ",
            "labelBn": "রোপণ",
            "labelEn": "Planting"
          },
          {
            "value": "আগাছা পরিষ্কার",
            "labelBn": "আগাছা পরিষ্কার",
            "labelEn": "Weeding"
          },
          {
            "value": "ফসল কাটা",
            "labelBn": "ফসল কাটা",
            "labelEn": "Harvesting"
          },
          {
            "value": "মাড়াই",
            "labelBn": "মাড়াই",
            "labelEn": "Threshing"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "labour_count",
        "labelBn": "শ্রমিকের সংখ্যা",
        "labelEn": "Labour Count",
        "type": "number",
        "required": false
      },
      {
        "name": "labour_duration",
        "labelBn": "কাজের সময়কাল",
        "labelEn": "Labour Duration",
        "type": "text",
        "required": false
      },
      {
        "name": "labour_date",
        "labelBn": "কাজ শুরুর তারিখ",
        "labelEn": "Labour Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "livestock",
    "titleBn": "গবাদিপশু পালন",
    "titleEn": "Livestock",
    "category": "কৃষি",
    "descriptionBn": "পশুর ধরন, সংখ্যা ও প্রয়োজনীয় সেবা জানিয়ে পালন, খাদ্য, খামার ব্যবস্থাপনা বা পশুস্বাস্থ্য-সংক্রান্ত সহায়তা চান।",
    "descriptionEn": "Livestock rearing, feed, farm management and services.",
    "icon": "🐄",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "গবাদিপশু-সংক্রান্ত তথ্য",
    "sectionEn": "Livestock details",
    "fields": [
      {
        "name": "livestock_type",
        "labelBn": "পশুর ধরন",
        "labelEn": "Livestock Type",
        "type": "text",
        "required": false
      },
      {
        "name": "livestock_count",
        "labelBn": "পশুর সংখ্যা",
        "labelEn": "Livestock Count",
        "type": "number",
        "required": false
      },
      {
        "name": "livestock_need",
        "labelBn": "সহায়তার ধরন",
        "labelEn": "Livestock Need",
        "type": "select",
        "options": [
          {
            "value": "পালন/খামার ব্যবস্থাপনা",
            "labelBn": "পালন/খামার ব্যবস্থাপনা",
            "labelEn": "Rearing/farm management"
          },
          {
            "value": "খাদ্য",
            "labelBn": "খাদ্য",
            "labelEn": "Feed"
          },
          {
            "value": "পশুস্বাস্থ্য পরামর্শ",
            "labelBn": "পশুস্বাস্থ্য পরামর্শ",
            "labelEn": "Animal health advice"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "livestock_issue",
        "labelBn": "সমস্যা বা প্রয়োজনের বিবরণ",
        "labelEn": "Livestock Issue",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "poultry",
    "titleBn": "পোল্ট্রি ও হাঁস-মুরগি",
    "titleEn": "Poultry",
    "category": "কৃষি",
    "descriptionBn": "পাখির ধরন, আনুমানিক সংখ্যা ও খামারের প্রয়োজন জানিয়ে পোল্ট্রি পালন, খাদ্য বা সেবা খুঁজুন।",
    "descriptionEn": "Poultry farms, feed, equipment and services.",
    "icon": "🐔",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "পোল্ট্রি-সংক্রান্ত তথ্য",
    "sectionEn": "Poultry details",
    "fields": [
      {
        "name": "poultry_type",
        "labelBn": "পাখির ধরন",
        "labelEn": "Poultry Type",
        "type": "text",
        "required": false
      },
      {
        "name": "poultry_count",
        "labelBn": "পাখির সংখ্যা",
        "labelEn": "Poultry Count",
        "type": "number",
        "required": false
      },
      {
        "name": "poultry_need",
        "labelBn": "সহায়তার ধরন",
        "labelEn": "Poultry Need",
        "type": "select",
        "options": [
          {
            "value": "খাদ্য",
            "labelBn": "খাদ্য",
            "labelEn": "Feed"
          },
          {
            "value": "খামার ব্যবস্থাপনা",
            "labelBn": "খামার ব্যবস্থাপনা",
            "labelEn": "খামার ব্যবস্থাপনা"
          },
          {
            "value": "পাখির স্বাস্থ্য পরামর্শ",
            "labelBn": "পাখির স্বাস্থ্য পরামর্শ",
            "labelEn": "Poultry health advice"
          },
          {
            "value": "সরঞ্জাম",
            "labelBn": "সরঞ্জাম",
            "labelEn": "Equipment"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "poultry_issue",
        "labelBn": "সমস্যা বা প্রয়োজন",
        "labelEn": "Poultry Issue",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "fisheries",
    "titleBn": "মৎস্য ও জলজ চাষ",
    "titleEn": "Fisheries & Aquaculture",
    "category": "কৃষি",
    "descriptionBn": "মাছের ধরন, পুকুরের পরিমাণ, চাষের পর্যায় ও প্রয়োজন জানিয়ে মৎস্যচাষ-সংক্রান্ত সেবা খুঁজুন।",
    "descriptionEn": "Fish farming, fingerlings, feed, ponds and fisheries services.",
    "icon": "🐟",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "মৎস্যচাষ-সংক্রান্ত তথ্য",
    "sectionEn": "Fisheries & Aquaculture details",
    "fields": [
      {
        "name": "fish_type",
        "labelBn": "মাছের ধরন",
        "labelEn": "Fish Type",
        "type": "text",
        "required": false
      },
      {
        "name": "pond_area",
        "labelBn": "পুকুর/জলাশয়ের পরিমাণ",
        "labelEn": "Pond Area",
        "type": "text",
        "required": false
      },
      {
        "name": "fish_stage",
        "labelBn": "চাষের পর্যায়",
        "labelEn": "Fish Stage",
        "type": "select",
        "options": [
          {
            "value": "পুকুর প্রস্তুতি",
            "labelBn": "পুকুর প্রস্তুতি",
            "labelEn": "Pond preparation"
          },
          {
            "value": "পোনা ছাড়ব",
            "labelBn": "পোনা ছাড়ব",
            "labelEn": "Stock fingerlings"
          },
          {
            "value": "চলমান চাষ",
            "labelBn": "চলমান চাষ",
            "labelEn": "Ongoing cultivation"
          },
          {
            "value": "মাছ বিক্রি",
            "labelBn": "মাছ বিক্রি",
            "labelEn": "Sell fish"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "fish_need",
        "labelBn": "সহায়তার ধরন",
        "labelEn": "Fish Need",
        "type": "select",
        "options": [
          {
            "value": "পোনা",
            "labelBn": "পোনা",
            "labelEn": "Fingerlings"
          },
          {
            "value": "খাদ্য",
            "labelBn": "খাদ্য",
            "labelEn": "Feed"
          },
          {
            "value": "পুকুর ব্যবস্থাপনা",
            "labelBn": "পুকুর ব্যবস্থাপনা",
            "labelEn": "Pond management"
          },
          {
            "value": "বাজার/বিক্রি",
            "labelBn": "বাজার/বিক্রি",
            "labelEn": "Market/sales"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      }
    ]
  },
  {
    "slug": "farm-inputs",
    "titleBn": "কৃষি উপকরণ বাজার",
    "titleEn": "Farm Inputs Marketplace",
    "category": "বাজার",
    "descriptionBn": "কৃষি উপকরণের নাম, পরিমাণ ও কেনা/বেচার প্রয়োজন জানিয়ে উপযুক্ত বিক্রেতা বা পণ্য খুঁজুন।",
    "descriptionEn": "Search farm-input sellers, listings and prices.",
    "icon": "🧰",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "কৃষি উপকরণ-সংক্রান্ত তথ্য",
    "sectionEn": "Farm Inputs Marketplace details",
    "fields": [
      {
        "name": "input_product",
        "labelBn": "উপকরণের নাম",
        "labelEn": "Input Product",
        "type": "text",
        "required": false
      },
      {
        "name": "input_trade",
        "labelBn": "আপনার প্রয়োজন",
        "labelEn": "Input Trade",
        "type": "select",
        "options": [
          {
            "value": "কিনতে চাই",
            "labelBn": "কিনতে চাই",
            "labelEn": "I want to buy"
          },
          {
            "value": "বিক্রি করতে চাই",
            "labelBn": "বিক্রি করতে চাই",
            "labelEn": "I want to sell"
          }
        ],
        "required": false
      },
      {
        "name": "input_quantity",
        "labelBn": "পরিমাণ ও একক",
        "labelEn": "Input Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "input_specs",
        "labelBn": "ব্র্যান্ড/মান/অন্যান্য শর্ত",
        "labelEn": "Input Specs",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "produce-market",
    "titleBn": "কৃষিপণ্য কেনাবেচা",
    "titleEn": "Produce Marketplace",
    "category": "বাজার",
    "descriptionBn": "কৃষিপণ্যের নাম, পরিমাণ, মান ও প্রস্তুতির সময় জানিয়ে ক্রেতা বা বিক্রেতার সঙ্গে সংযোগের অনুরোধ দিন।",
    "descriptionEn": "Connect farmers and buyers for produce transactions.",
    "icon": "🛒",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "কৃষিপণ্য কেনাবেচা-সংক্রান্ত তথ্য",
    "sectionEn": "Produce Marketplace details",
    "fields": [
      {
        "name": "produce_name",
        "labelBn": "পণ্যের নাম",
        "labelEn": "Produce Name",
        "type": "text",
        "required": false
      },
      {
        "name": "produce_trade",
        "labelBn": "আপনার ভূমিকা",
        "labelEn": "Produce Trade",
        "type": "select",
        "options": [
          {
            "value": "বিক্রেতা/কৃষক",
            "labelBn": "বিক্রেতা/কৃষক",
            "labelEn": "Seller/farmer"
          },
          {
            "value": "ক্রেতা",
            "labelBn": "ক্রেতা",
            "labelEn": "Buyer"
          }
        ],
        "required": false
      },
      {
        "name": "produce_quantity",
        "labelBn": "পরিমাণ ও একক",
        "labelEn": "Produce Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "produce_grade",
        "labelBn": "মান/গ্রেড বা অন্যান্য শর্ত",
        "labelEn": "Produce Grade",
        "type": "text",
        "required": false
      },
      {
        "name": "produce_ready_date",
        "labelBn": "পণ্য প্রস্তুত/প্রয়োজনের তারিখ",
        "labelEn": "Produce Ready Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "wholesale-buyers",
    "titleBn": "পাইকারি ক্রেতা ও আড়তদার",
    "titleEn": "Wholesale Buyers & Aratdar",
    "category": "বাজার",
    "descriptionBn": "পণ্য, পাইকারি পরিমাণ, বাজার/গন্তব্য ও সরবরাহের সময় জানিয়ে আড়তদার বা বাল্ক ক্রেতার সঙ্গে সংযোগ চান।",
    "descriptionEn": "Connect with wholesale buyers, aratdars and bulk orders.",
    "icon": "🏬",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "পাইকারি সংযোগ-সংক্রান্ত তথ্য",
    "sectionEn": "Wholesale Buyers & Aratdar details",
    "fields": [
      {
        "name": "wholesale_product",
        "labelBn": "পণ্যের নাম",
        "labelEn": "Wholesale Product",
        "type": "text",
        "required": false
      },
      {
        "name": "wholesale_quantity",
        "labelBn": "পাইকারি পরিমাণ ও একক",
        "labelEn": "Wholesale Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "wholesale_role",
        "labelBn": "আপনার ভূমিকা",
        "labelEn": "Wholesale Role",
        "type": "select",
        "options": [
          {
            "value": "বিক্রেতা/কৃষক",
            "labelBn": "বিক্রেতা/কৃষক",
            "labelEn": "Seller/farmer"
          },
          {
            "value": "পাইকারি ক্রেতা",
            "labelBn": "পাইকারি ক্রেতা",
            "labelEn": "Wholesale buyer"
          },
          {
            "value": "আড়তদার",
            "labelBn": "আড়তদার",
            "labelEn": "Wholesaler"
          }
        ],
        "required": false
      },
      {
        "name": "wholesale_timing",
        "labelBn": "সরবরাহ/ক্রয়ের সময়",
        "labelEn": "Wholesale Timing",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "daily-market-price",
    "titleBn": "দৈনিক বাজারদর",
    "titleEn": "Daily Market Prices",
    "category": "বাজার",
    "descriptionBn": "পণ্যের নাম, বাজার, দর ও এককসহ তথ্য দিন; প্রকাশের আগে জমা দেওয়া বাজারদর যাচাই করা হবে।",
    "descriptionEn": "Submit, verify and display market-specific prices.",
    "icon": "📊",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "বাজারদর-সংক্রান্ত তথ্য",
    "sectionEn": "Daily Market Prices details",
    "fields": [
      {
        "name": "price_product",
        "labelBn": "পণ্যের নাম",
        "labelEn": "Price Product",
        "type": "text",
        "required": false
      },
      {
        "name": "price_market",
        "labelBn": "বাজার ও এলাকা",
        "labelEn": "Price Market",
        "type": "text",
        "required": false
      },
      {
        "name": "price_amount",
        "labelBn": "দর (৳)",
        "labelEn": "Price Amount",
        "type": "number",
        "required": false
      },
      {
        "name": "price_unit",
        "labelBn": "দরের একক",
        "labelEn": "Price Unit",
        "type": "text",
        "required": false
      },
      {
        "name": "price_date",
        "labelBn": "দরটি যে তারিখের",
        "labelEn": "Price Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "storage-warehouse",
    "titleBn": "গুদাম ও সংরক্ষণ",
    "titleEn": "Storage & Warehousing",
    "category": "বাজার",
    "descriptionBn": "কোন পণ্য, কত পরিমাণ, কী ধরনের সংরক্ষণ ও কত সময়ের জন্য দরকার তা জানিয়ে গুদাম খুঁজুন।",
    "descriptionEn": "Find warehouses, cold storage and crop storage.",
    "icon": "🏢",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "সংরক্ষণ-সংক্রান্ত তথ্য",
    "sectionEn": "Storage & Warehousing details",
    "fields": [
      {
        "name": "storage_product",
        "labelBn": "সংরক্ষণের পণ্য",
        "labelEn": "Storage Product",
        "type": "text",
        "required": false
      },
      {
        "name": "storage_quantity",
        "labelBn": "পরিমাণ ও একক",
        "labelEn": "Storage Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "storage_type",
        "labelBn": "সংরক্ষণের ধরন",
        "labelEn": "Storage Type",
        "type": "select",
        "options": [
          {
            "value": "সাধারণ গুদাম",
            "labelBn": "সাধারণ গুদাম",
            "labelEn": "General warehouse"
          },
          {
            "value": "শীতল সংরক্ষণ",
            "labelBn": "শীতল সংরক্ষণ",
            "labelEn": "Cold storage"
          },
          {
            "value": "শুকনো সংরক্ষণ",
            "labelBn": "শুকনো সংরক্ষণ",
            "labelEn": "Dry storage"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "storage_duration",
        "labelBn": "কতদিনের জন্য",
        "labelEn": "Storage Duration",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "transport-logistics",
    "titleBn": "পরিবহন ও লজিস্টিকস",
    "titleEn": "Transport & Logistics",
    "category": "বাজার",
    "descriptionBn": "কী পণ্য, কত পরিমাণ, কোথা থেকে কোথায় এবং কখন নিতে হবে তা জানিয়ে পরিবহনের অনুরোধ দিন।",
    "descriptionEn": "Arrange crop transport, truck/van bookings and delivery.",
    "icon": "🚚",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "পরিবহন-সংক্রান্ত তথ্য",
    "sectionEn": "Transport & Logistics details",
    "fields": [
      {
        "name": "transport_product",
        "labelBn": "পণ্য/মালামালের নাম",
        "labelEn": "Transport Product",
        "type": "text",
        "required": false
      },
      {
        "name": "transport_quantity",
        "labelBn": "পরিমাণ/আনুমানিক ওজন",
        "labelEn": "Transport Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "transport_pickup",
        "labelBn": "পণ্য তোলার স্থান",
        "labelEn": "Transport Pickup",
        "type": "text",
        "required": false
      },
      {
        "name": "transport_destination",
        "labelBn": "গন্তব্য",
        "labelEn": "Transport Destination",
        "type": "text",
        "required": false
      },
      {
        "name": "transport_date",
        "labelBn": "পরিবহনের তারিখ",
        "labelEn": "Transport Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "food-processing",
    "titleBn": "প্রক্রিয়াজাতকরণ ও প্যাকেজিং",
    "titleEn": "Processing & Packaging",
    "category": "বাজার",
    "descriptionBn": "কৃষিপণ্যের নাম, পরিমাণ ও প্রয়োজনীয় প্রক্রিয়াজাতকরণ/প্যাকেজিং জানিয়ে উপযুক্ত সেবা খুঁজুন।",
    "descriptionEn": "Find produce processing, grading and packaging services.",
    "icon": "📦",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "প্রক্রিয়াজাতকরণ-সংক্রান্ত তথ্য",
    "sectionEn": "Processing & Packaging details",
    "fields": [
      {
        "name": "processing_product",
        "labelBn": "পণ্যের নাম",
        "labelEn": "Processing Product",
        "type": "text",
        "required": false
      },
      {
        "name": "processing_quantity",
        "labelBn": "পরিমাণ ও একক",
        "labelEn": "Processing Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "processing_type",
        "labelBn": "প্রয়োজনীয় কাজ",
        "labelEn": "Processing Type",
        "type": "select",
        "options": [
          {
            "value": "পরিষ্কার/বাছাই",
            "labelBn": "পরিষ্কার/বাছাই",
            "labelEn": "Cleaning/sorting"
          },
          {
            "value": "গ্রেডিং",
            "labelBn": "গ্রেডিং",
            "labelEn": "Grading"
          },
          {
            "value": "প্রক্রিয়াজাতকরণ",
            "labelBn": "প্রক্রিয়াজাতকরণ",
            "labelEn": "Processing"
          },
          {
            "value": "প্যাকেজিং",
            "labelBn": "প্যাকেজিং",
            "labelEn": "Packaging"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "processing_package",
        "labelBn": "প্যাকেজিং/মানের শর্ত",
        "labelEn": "Processing Package",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "export-support",
    "titleBn": "রপ্তানি সহায়তা",
    "titleEn": "Export Support",
    "category": "বাজার",
    "descriptionBn": "রপ্তানির সম্ভাব্য পণ্য, পরিমাণ, গন্তব্য ও মান/প্যাকেজিং-সংক্রান্ত প্রয়োজন জানিয়ে সহায়তা চান।",
    "descriptionEn": "Connect with export-oriented product, quality and packaging services.",
    "icon": "🌍",
    "categoryId": "market-supply",
    "formVersion": 1,
    "sectionBn": "রপ্তানি-সংক্রান্ত তথ্য",
    "sectionEn": "Export Support details",
    "fields": [
      {
        "name": "export_product",
        "labelBn": "পণ্যের নাম",
        "labelEn": "Export Product",
        "type": "text",
        "required": false
      },
      {
        "name": "export_quantity",
        "labelBn": "সম্ভাব্য পরিমাণ ও একক",
        "labelEn": "Export Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "export_destination",
        "labelBn": "সম্ভাব্য দেশ/বাজার",
        "labelEn": "Export Destination",
        "type": "text",
        "required": false
      },
      {
        "name": "export_requirements",
        "labelBn": "মান, সনদ বা প্যাকেজিংয়ের প্রয়োজন",
        "labelEn": "Export Requirements",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "land-equipment",
    "titleBn": "কৃষিজমি ও যন্ত্রপাতি",
    "titleEn": "Farm Land & Equipment",
    "category": "কৃষি",
    "descriptionBn": "কৃষিজমি বা যন্ত্রপাতির ধরন, এলাকা/সক্ষমতা এবং ভাড়া/কেনাবেচার প্রয়োজন জানিয়ে অনুসন্ধান করুন।",
    "descriptionEn": "Explore farm land, equipment and agricultural assets.",
    "icon": "🗺️",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "জমি ও যন্ত্রপাতি-সংক্রান্ত তথ্য",
    "sectionEn": "Farm Land & Equipment details",
    "fields": [
      {
        "name": "asset_type",
        "labelBn": "যা খুঁজছেন",
        "labelEn": "Asset Type",
        "type": "select",
        "options": [
          {
            "value": "কৃষিজমি",
            "labelBn": "কৃষিজমি",
            "labelEn": "Farm land"
          },
          {
            "value": "কৃষিযন্ত্র",
            "labelBn": "কৃষিযন্ত্র",
            "labelEn": "Farm machinery"
          },
          {
            "value": "অন্যান্য কৃষি সম্পদ",
            "labelBn": "অন্যান্য কৃষি সম্পদ",
            "labelEn": "Other farm asset"
          }
        ],
        "required": false
      },
      {
        "name": "asset_size",
        "labelBn": "পরিমাণ/সক্ষমতা",
        "labelEn": "Asset Size",
        "type": "text",
        "required": false
      },
      {
        "name": "asset_transaction",
        "labelBn": "প্রয়োজনের ধরন",
        "labelEn": "Asset Transaction",
        "type": "select",
        "options": [
          {
            "value": "ভাড়া নিতে চাই",
            "labelBn": "ভাড়া নিতে চাই",
            "labelEn": "Rent"
          },
          {
            "value": "ভাড়া দিতে চাই",
            "labelBn": "ভাড়া দিতে চাই",
            "labelEn": "Offer for rent"
          },
          {
            "value": "কিনতে চাই",
            "labelBn": "কিনতে চাই",
            "labelEn": "I want to buy"
          },
          {
            "value": "বিক্রি করতে চাই",
            "labelBn": "বিক্রি করতে চাই",
            "labelEn": "I want to sell"
          }
        ],
        "required": false
      },
      {
        "name": "asset_timing",
        "labelBn": "কখন প্রয়োজন",
        "labelEn": "Asset Timing",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "training-advice",
    "titleBn": "কৃষি প্রশিক্ষণ ও পরামর্শ",
    "titleEn": "Training & Advisory",
    "category": "কৃষি",
    "descriptionBn": "কোন বিষয়ে, কীভাবে ও কখন প্রশিক্ষণ বা বিশেষজ্ঞ পরামর্শ চান তা জানিয়ে অনুরোধ দিন।",
    "descriptionEn": "Request training, knowledge sharing and expert advice.",
    "icon": "🎓",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "প্রশিক্ষণ ও পরামর্শ-সংক্রান্ত তথ্য",
    "sectionEn": "Training & Advisory details",
    "fields": [
      {
        "name": "training_topic",
        "labelBn": "প্রশিক্ষণ/পরামর্শের বিষয়",
        "labelEn": "Training Topic",
        "type": "text",
        "required": false
      },
      {
        "name": "training_experience",
        "labelBn": "আপনার অভিজ্ঞতা/বর্তমান পর্যায়",
        "labelEn": "Training Experience",
        "type": "text",
        "required": false
      },
      {
        "name": "training_format",
        "labelBn": "পছন্দের মাধ্যম",
        "labelEn": "Training Format",
        "type": "select",
        "options": [
          {
            "value": "সশরীরে",
            "labelBn": "সশরীরে",
            "labelEn": "In person"
          },
          {
            "value": "অনলাইন",
            "labelBn": "অনলাইন",
            "labelEn": "Online"
          },
          {
            "value": "যেকোনো",
            "labelBn": "যেকোনো",
            "labelEn": "Either"
          }
        ],
        "required": false
      },
      {
        "name": "training_date",
        "labelBn": "পছন্দের তারিখ",
        "labelEn": "Training Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "organic-farming",
    "titleBn": "জৈব কৃষি",
    "titleEn": "Organic Farming",
    "category": "কৃষি",
    "descriptionBn": "ফসল, জমি ও বর্তমান পদ্ধতি জানিয়ে জৈব উৎপাদন, কম্পোস্ট বা টেকসই চাষে সহায়তা চান।",
    "descriptionEn": "Organic production, compost and sustainable farming methods.",
    "icon": "🍃",
    "categoryId": "crop-production",
    "formVersion": 1,
    "sectionBn": "জৈব কৃষি-সংক্রান্ত তথ্য",
    "sectionEn": "Organic Farming details",
    "fields": [
      {
        "name": "organic_crop",
        "labelBn": "ফসল/পণ্যের নাম",
        "labelEn": "Organic Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "organic_area",
        "labelBn": "জমির পরিমাণ",
        "labelEn": "Organic Area",
        "type": "text",
        "required": false
      },
      {
        "name": "organic_practice",
        "labelBn": "বর্তমানে কী পদ্ধতি অনুসরণ করছেন",
        "labelEn": "Organic Practice",
        "type": "text",
        "required": false
      },
      {
        "name": "organic_need",
        "labelBn": "কী বিষয়ে সহায়তা চান",
        "labelEn": "Organic Need",
        "type": "select",
        "options": [
          {
            "value": "কম্পোস্ট",
            "labelBn": "কম্পোস্ট",
            "labelEn": "Compost"
          },
          {
            "value": "জৈব বালাই ব্যবস্থাপনা",
            "labelBn": "জৈব বালাই ব্যবস্থাপনা",
            "labelEn": "Organic pest management"
          },
          {
            "value": "উৎপাদন পদ্ধতি",
            "labelBn": "উৎপাদন পদ্ধতি",
            "labelEn": "Production methods"
          },
          {
            "value": "সনদ/মান",
            "labelBn": "সনদ/মান",
            "labelEn": "Certification/standards"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      }
    ]
  },
  {
    "slug": "contract-farming",
    "titleBn": "চুক্তিভিত্তিক চাষ",
    "titleEn": "Contract Farming",
    "category": "বাজার",
    "descriptionBn": "ফসল, উৎপাদনের পরিমাণ, মৌসুম ও সম্ভাব্য ক্রয়-বিক্রয় শর্ত জানিয়ে চাষি-ক্রেতা সংযোগ চান।",
    "descriptionEn": "Connect farmers and buyers for agreed production contracts.",
    "icon": "🤝",
    "categoryId": "farm-enterprises",
    "formVersion": 1,
    "sectionBn": "চুক্তিভিত্তিক চাষ-সংক্রান্ত তথ্য",
    "sectionEn": "Contract Farming details",
    "fields": [
      {
        "name": "contract_crop",
        "labelBn": "ফসল/পণ্যের নাম",
        "labelEn": "Contract Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "contract_quantity",
        "labelBn": "সম্ভাব্য পরিমাণ ও একক",
        "labelEn": "Contract Quantity",
        "type": "text",
        "required": false
      },
      {
        "name": "contract_role",
        "labelBn": "আপনার ভূমিকা",
        "labelEn": "Contract Role",
        "type": "select",
        "options": [
          {
            "value": "চাষি/উৎপাদক",
            "labelBn": "চাষি/উৎপাদক",
            "labelEn": "Farmer/producer"
          },
          {
            "value": "ক্রেতা",
            "labelBn": "ক্রেতা",
            "labelEn": "Buyer"
          }
        ],
        "required": false
      },
      {
        "name": "contract_terms",
        "labelBn": "মৌসুম/সম্ভাব্য শর্ত",
        "labelEn": "Contract Terms",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "farm-finance",
    "titleBn": "কৃষি অর্থায়ন তথ্য",
    "titleEn": "Agricultural Finance Info",
    "category": "অর্থায়ন",
    "descriptionBn": "কৃষি অর্থায়ন পণ্য ও যোগ্যতার তথ্য জানতে আপনার কৃষি উদ্যোগ ও অর্থায়নের উদ্দেশ্য জানান। ঋণ অনুমোদনের নিশ্চয়তা নেই।",
    "descriptionEn": "Explore agricultural loan products and eligibility information.",
    "icon": "💳",
    "categoryId": "finance",
    "formVersion": 1,
    "sectionBn": "কৃষি অর্থায়ন-সংক্রান্ত তথ্য",
    "sectionEn": "Agricultural Finance Info details",
    "fields": [
      {
        "name": "finance_purpose",
        "labelBn": "অর্থায়নের উদ্দেশ্য",
        "labelEn": "Finance Purpose",
        "type": "select",
        "options": [
          {
            "value": "ফসল উৎপাদন",
            "labelBn": "ফসল উৎপাদন",
            "labelEn": "Crop production"
          },
          {
            "value": "কৃষি উপকরণ",
            "labelBn": "কৃষি উপকরণ",
            "labelEn": "Farm inputs"
          },
          {
            "value": "যন্ত্রপাতি",
            "labelBn": "যন্ত্রপাতি",
            "labelEn": "Equipment"
          },
          {
            "value": "খামার/ব্যবসা সম্প্রসারণ",
            "labelBn": "খামার/ব্যবসা সম্প্রসারণ",
            "labelEn": "Farm/business expansion"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "finance_enterprise",
        "labelBn": "ফসল/কৃষি উদ্যোগ",
        "labelEn": "Finance Enterprise",
        "type": "text",
        "required": false
      },
      {
        "name": "finance_amount",
        "labelBn": "আনুমানিক প্রয়োজনীয় অর্থ (৳)",
        "labelEn": "Finance Amount",
        "type": "number",
        "required": false
      },
      {
        "name": "finance_timing",
        "labelBn": "কখন প্রয়োজন",
        "labelEn": "Finance Timing",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "insurance-claims",
    "titleBn": "ফসল বীমা ও ক্ষতিপূরণ তথ্য",
    "titleEn": "Crop Insurance Info",
    "category": "অর্থায়ন",
    "descriptionBn": "ফসল/বীমা, ক্ষতির কারণ ও ঘটনার তারিখ জানিয়ে বীমা পণ্য বা দাবি প্রক্রিয়া সম্পর্কে তথ্য চান।",
    "descriptionEn": "Information on insurance products, claims and related services.",
    "icon": "🧾",
    "categoryId": "finance",
    "formVersion": 1,
    "sectionBn": "ফসল বীমা-সংক্রান্ত তথ্য",
    "sectionEn": "Crop Insurance Info details",
    "fields": [
      {
        "name": "insurance_crop",
        "labelBn": "ফসল/বীমার ধরন",
        "labelEn": "Insurance Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "insurance_event",
        "labelBn": "ক্ষতির কারণ",
        "labelEn": "Insurance Event",
        "type": "select",
        "options": [
          {
            "value": "বন্যা",
            "labelBn": "বন্যা",
            "labelEn": "Flood"
          },
          {
            "value": "খরা",
            "labelBn": "খরা",
            "labelEn": "Drought"
          },
          {
            "value": "ঝড়/প্রাকৃতিক দুর্যোগ",
            "labelBn": "ঝড়/প্রাকৃতিক দুর্যোগ",
            "labelEn": "Storm/natural disaster"
          },
          {
            "value": "রোগবালাই",
            "labelBn": "রোগবালাই",
            "labelEn": "Pest/disease"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "insurance_event_date",
        "labelBn": "ঘটনার তারিখ",
        "labelEn": "Insurance Event Date",
        "type": "date",
        "required": false
      },
      {
        "name": "insurance_status",
        "labelBn": "পলিসি/দাবির অবস্থা",
        "labelEn": "Insurance Status",
        "type": "select",
        "options": [
          {
            "value": "তথ্য জানতে চাই",
            "labelBn": "তথ্য জানতে চাই",
            "labelEn": "Request information"
          },
          {
            "value": "বীমা করা আছে",
            "labelBn": "বীমা করা আছে",
            "labelEn": "Insured"
          },
          {
            "value": "দাবি জমা দিয়েছি",
            "labelBn": "দাবি জমা দিয়েছি",
            "labelEn": "Claim submitted"
          }
        ],
        "required": false
      }
    ]
  },
  {
    "slug": "weather-alerts",
    "titleBn": "আবহাওয়া ও সতর্কতা",
    "titleEn": "Weather & Alerts",
    "category": "তথ্য",
    "descriptionBn": "কোন এলাকার, কোন ফসলের জন্য এবং কী ধরনের আবহাওয়া তথ্য বা সতর্কতা প্রয়োজন তা জানান।",
    "descriptionEn": "A place for weather information and alerts.",
    "icon": "🌦️",
    "categoryId": "information-community",
    "formVersion": 1,
    "sectionBn": "আবহাওয়া-সংক্রান্ত তথ্য",
    "sectionEn": "Weather & Alerts details",
    "fields": [
      {
        "name": "weather_area",
        "labelBn": "এলাকা/ইউনিয়ন",
        "labelEn": "Weather Area",
        "type": "text",
        "required": false
      },
      {
        "name": "weather_crop",
        "labelBn": "ফসল/কৃষিকাজ",
        "labelEn": "Weather Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "weather_alert_type",
        "labelBn": "তথ্য/সতর্কতার ধরন",
        "labelEn": "Weather Alert Type",
        "type": "select",
        "options": [
          {
            "value": "বৃষ্টি/বন্যা",
            "labelBn": "বৃষ্টি/বন্যা",
            "labelEn": "Rain/flood"
          },
          {
            "value": "ঝড়/বজ্রপাত",
            "labelBn": "ঝড়/বজ্রপাত",
            "labelEn": "Storm/lightning"
          },
          {
            "value": "তাপপ্রবাহ",
            "labelBn": "তাপপ্রবাহ",
            "labelEn": "Heatwave"
          },
          {
            "value": "ঠান্ডা/কুয়াশা",
            "labelBn": "ঠান্ডা/কুয়াশা",
            "labelEn": "Cold/fog"
          },
          {
            "value": "সাধারণ পূর্বাভাস",
            "labelBn": "সাধারণ পূর্বাভাস",
            "labelEn": "General forecast"
          }
        ],
        "required": false
      },
      {
        "name": "weather_period",
        "labelBn": "কোন সময়ের জন্য",
        "labelEn": "Weather Period",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "disaster-support",
    "titleBn": "দুর্যোগে কৃষি সহায়তা",
    "titleEn": "Agriculture Disaster Support",
    "category": "তথ্য",
    "descriptionBn": "দুর্যোগের ধরন, ক্ষতিগ্রস্ত এলাকা ও কৃষির ক্ষতির বিবরণ জানিয়ে সহায়তা সমন্বয়ের অনুরোধ দিন।",
    "descriptionEn": "Coordinate support requests after floods, droughts and disasters.",
    "icon": "🆘",
    "categoryId": "information-community",
    "formVersion": 1,
    "sectionBn": "দুর্যোগ-সহায়তা-সংক্রান্ত তথ্য",
    "sectionEn": "Agriculture Disaster Support details",
    "fields": [
      {
        "name": "disaster_type",
        "labelBn": "দুর্যোগের ধরন",
        "labelEn": "Disaster Type",
        "type": "select",
        "options": [
          {
            "value": "বন্যা",
            "labelBn": "বন্যা",
            "labelEn": "Flood"
          },
          {
            "value": "খরা",
            "labelBn": "খরা",
            "labelEn": "Drought"
          },
          {
            "value": "ঘূর্ণিঝড়/ঝড়",
            "labelBn": "ঘূর্ণিঝড়/ঝড়",
            "labelEn": "Cyclone/storm"
          },
          {
            "value": "জলাবদ্ধতা",
            "labelBn": "জলাবদ্ধতা",
            "labelEn": "Waterlogging"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "disaster_area",
        "labelBn": "ক্ষতিগ্রস্ত এলাকা",
        "labelEn": "Disaster Area",
        "type": "text",
        "required": false
      },
      {
        "name": "disaster_crop",
        "labelBn": "ক্ষতিগ্রস্ত ফসল/সম্পদ",
        "labelEn": "Disaster Crop",
        "type": "text",
        "required": false
      },
      {
        "name": "disaster_need",
        "labelBn": "জরুরি সহায়তার প্রয়োজন",
        "labelEn": "Disaster Need",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "women-farmers",
    "titleBn": "নারী কৃষক ও উদ্যোক্তা",
    "titleEn": "Women Farmers & Entrepreneurs",
    "category": "কমিউনিটি",
    "descriptionBn": "আপনার কৃষি উদ্যোগ, পণ্য ও বাজার/সেবা-সংক্রান্ত প্রয়োজন জানিয়ে উপযুক্ত সংযোগ চান।",
    "descriptionEn": "Connect women farmers and agripreneurs with markets and services.",
    "icon": "👩‍🌾",
    "categoryId": "information-community",
    "formVersion": 1,
    "sectionBn": "নারী কৃষক/উদ্যোক্তা-সংক্রান্ত তথ্য",
    "sectionEn": "Women Farmers & Entrepreneurs details",
    "fields": [
      {
        "name": "women_enterprise",
        "labelBn": "কৃষি উদ্যোগ/পণ্যের নাম",
        "labelEn": "Women Enterprise",
        "type": "text",
        "required": false
      },
      {
        "name": "women_role",
        "labelBn": "আপনার ভূমিকা",
        "labelEn": "Women Role",
        "type": "select",
        "options": [
          {
            "value": "কৃষক/উৎপাদক",
            "labelBn": "কৃষক/উৎপাদক",
            "labelEn": "Farmer/producer"
          },
          {
            "value": "উদ্যোক্তা",
            "labelBn": "উদ্যোক্তা",
            "labelEn": "Entrepreneur"
          },
          {
            "value": "প্রক্রিয়াজাতকারী",
            "labelBn": "প্রক্রিয়াজাতকারী",
            "labelEn": "Processor"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "women_capacity",
        "labelBn": "উৎপাদন/সরবরাহের পরিমাণ",
        "labelEn": "Women Capacity",
        "type": "text",
        "required": false
      },
      {
        "name": "women_support",
        "labelBn": "কী ধরনের সংযোগ প্রয়োজন",
        "labelEn": "Women Support",
        "type": "select",
        "options": [
          {
            "value": "বাজার/ক্রেতা",
            "labelBn": "বাজার/ক্রেতা",
            "labelEn": "Market/buyer"
          },
          {
            "value": "প্রশিক্ষণ",
            "labelBn": "প্রশিক্ষণ",
            "labelEn": "Training"
          },
          {
            "value": "উপকরণ/সেবা",
            "labelBn": "উপকরণ/সেবা",
            "labelEn": "Inputs/services"
          },
          {
            "value": "অর্থায়ন তথ্য",
            "labelBn": "অর্থায়ন তথ্য",
            "labelEn": "Finance information"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      }
    ]
  },
  {
    "slug": "youth-agripreneurs",
    "titleBn": "যুব কৃষি উদ্যোক্তা",
    "titleEn": "Youth Agripreneurs",
    "category": "কমিউনিটি",
    "descriptionBn": "কৃষি উদ্যোগের ধারণা/পর্যায় ও কী ধরনের প্রশিক্ষণ, বাজার বা অংশীদারিত্ব চান তা জানান।",
    "descriptionEn": "Help young agripreneurs find ideas, training, markets and partners.",
    "icon": "🚀",
    "categoryId": "information-community",
    "formVersion": 1,
    "sectionBn": "যুব কৃষি উদ্যোগ-সংক্রান্ত তথ্য",
    "sectionEn": "Youth Agripreneurs details",
    "fields": [
      {
        "name": "youth_idea",
        "labelBn": "উদ্যোগের ধারণা/ক্ষেত্র",
        "labelEn": "Youth Idea",
        "type": "text",
        "required": false
      },
      {
        "name": "youth_stage",
        "labelBn": "উদ্যোগের বর্তমান পর্যায়",
        "labelEn": "Youth Stage",
        "type": "select",
        "options": [
          {
            "value": "পরিকল্পনা করছি",
            "labelBn": "পরিকল্পনা করছি",
            "labelEn": "Planning"
          },
          {
            "value": "শুরু করেছি",
            "labelBn": "শুরু করেছি",
            "labelEn": "Started"
          },
          {
            "value": "চলমান উদ্যোগ",
            "labelBn": "চলমান উদ্যোগ",
            "labelEn": "Ongoing business"
          }
        ],
        "required": false
      },
      {
        "name": "youth_support",
        "labelBn": "কী ধরনের সহায়তা চান",
        "labelEn": "Youth Support",
        "type": "select",
        "options": [
          {
            "value": "প্রশিক্ষণ/পরামর্শ",
            "labelBn": "প্রশিক্ষণ/পরামর্শ",
            "labelEn": "Training/advice"
          },
          {
            "value": "বাজার/ক্রেতা",
            "labelBn": "বাজার/ক্রেতা",
            "labelEn": "Market/buyer"
          },
          {
            "value": "অংশীদার",
            "labelBn": "অংশীদার",
            "labelEn": "Partner"
          },
          {
            "value": "অর্থায়ন তথ্য",
            "labelBn": "অর্থায়ন তথ্য",
            "labelEn": "Finance information"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "youth_capacity",
        "labelBn": "উৎপাদন/পরিকল্পনার পরিমাণ",
        "labelEn": "Youth Capacity",
        "type": "text",
        "required": false
      }
    ]
  },
  {
    "slug": "worker-marketplace",
    "titleBn": "শ্রম ও দক্ষ কর্মী মার্কেটপ্লেস",
    "titleEn": "Worker Marketplace",
    "category": "শ্রম",
    "descriptionBn": "কাজের ধরন, প্রয়োজনীয় দক্ষতা, কর্মীর সংখ্যা ও সময় জানিয়ে কৃষি/বাজারকাজের কর্মী খুঁজুন।",
    "descriptionEn": "Find skilled and general workers for agriculture and market-related jobs.",
    "icon": "🧑‍🔧",
    "categoryId": "labor-machinery",
    "formVersion": 1,
    "sectionBn": "কর্মী-সংক্রান্ত তথ্য",
    "sectionEn": "Worker Marketplace details",
    "fields": [
      {
        "name": "worker_task",
        "labelBn": "কাজের ধরন",
        "labelEn": "Worker Task",
        "type": "text",
        "required": false
      },
      {
        "name": "worker_skill",
        "labelBn": "প্রয়োজনীয় দক্ষতা",
        "labelEn": "Worker Skill",
        "type": "text",
        "required": false
      },
      {
        "name": "worker_count",
        "labelBn": "কর্মীর সংখ্যা",
        "labelEn": "Worker Count",
        "type": "number",
        "required": false
      },
      {
        "name": "worker_date",
        "labelBn": "কাজের তারিখ",
        "labelEn": "Worker Date",
        "type": "date",
        "required": false
      }
    ]
  },
  {
    "slug": "community-reports",
    "titleBn": "কৃষি সমস্যা ও কমিউনিটি রিপোর্ট",
    "titleEn": "Community Reports",
    "category": "কমিউনিটি",
    "descriptionBn": "স্থানীয় কৃষি, বাজার বা সেবার সমস্যা, কোথায়/কখন ঘটেছে এবং কী পদক্ষেপ চান তা জানান।",
    "descriptionEn": "Report local farming issues, market irregularities or service problems.",
    "icon": "📣",
    "categoryId": "information-community",
    "formVersion": 1,
    "sectionBn": "কমিউনিটি রিপোর্ট-সংক্রান্ত তথ্য",
    "sectionEn": "Community Reports details",
    "fields": [
      {
        "name": "report_type",
        "labelBn": "সমস্যার ধরন",
        "labelEn": "Report Type",
        "type": "select",
        "options": [
          {
            "value": "কৃষি সমস্যা",
            "labelBn": "কৃষি সমস্যা",
            "labelEn": "Agriculture issue"
          },
          {
            "value": "বাজার অনিয়ম",
            "labelBn": "বাজার অনিয়ম",
            "labelEn": "Market irregularity"
          },
          {
            "value": "সেবা-সংক্রান্ত সমস্যা",
            "labelBn": "সেবা-সংক্রান্ত সমস্যা",
            "labelEn": "Service issue"
          },
          {
            "value": "অন্যান্য",
            "labelBn": "অন্যান্য",
            "labelEn": "Other"
          }
        ],
        "required": false
      },
      {
        "name": "report_location",
        "labelBn": "ঘটনার স্থান",
        "labelEn": "Report Location",
        "type": "text",
        "required": false
      },
      {
        "name": "report_date",
        "labelBn": "ঘটনার তারিখ/সময়",
        "labelEn": "Report Date",
        "type": "text",
        "required": false
      },
      {
        "name": "report_action",
        "labelBn": "কী সহায়তা/পদক্ষেপ আশা করছেন",
        "labelEn": "Report Action",
        "type": "text",
        "required": false
      }
    ]
  }
] as const;

export type AgricultureService = (typeof agricultureServiceRegistry)[number];
export type AgricultureServiceField = AgricultureService["fields"][number];

export const agricultureServiceCategories = [
  {
    "id": "crop-production",
    "labelEn": "Crop production",
    "labelBn": "ফসল উৎপাদন"
  },
  {
    "id": "farm-enterprises",
    "labelEn": "Farm enterprises",
    "labelBn": "খামার উদ্যোগ"
  },
  {
    "id": "market-supply",
    "labelEn": "Markets & supply",
    "labelBn": "বাজার ও সরবরাহ"
  },
  {
    "id": "labor-machinery",
    "labelEn": "Labor & machinery",
    "labelBn": "শ্রম ও যন্ত্রপাতি"
  },
  {
    "id": "finance",
    "labelEn": "Finance",
    "labelBn": "অর্থায়ন"
  },
  {
    "id": "information-community",
    "labelEn": "Information & community",
    "labelBn": "তথ্য ও কমিউনিটি"
  }
] as const;
