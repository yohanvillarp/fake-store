-- =============================================================================
-- Seed: Authentic Sample of Products from Olist Dataset
-- Real product_id and category_name from olist_products_dataset
-- display_name crafted for the Fake Store UI presentation
-- =============================================================================

INSERT INTO fake_store_products (
    product_id,
    display_name,
    category_name,
    price,
    stock,
    weight_g,
    length_cm,
    height_cm,
    width_cm,
    source
) VALUES
(
    '1e9e8ef04dbcff4541ed26657ea517e5',
    'Pixel Desk Lamp',
    'furniture_decor',
    59.90,
    15,
    450,
    20,
    30,
    15,
    'olist'
),
(
    'a4597b830d1f855d045d949b29e06180',
    'Minimalist Ceramic Mug',
    'housewares',
    34.50,
    24,
    320,
    12,
    10,
    10,
    'olist'
),
(
    '368c6c730842d78016ad823897a372db',
    'Retro Mechanical Keyboard',
    'computers_accessories',
    289.00,
    8,
    950,
    35,
    4,
    14,
    'olist'
),
(
    'e0d64dc22b6482d0430d9716b1464877',
    'Cozy Cotton Bed Sheets',
    'bed_bath_table',
    119.90,
    12,
    1200,
    30,
    8,
    25,
    'olist'
),
(
    '53b36df63ebb7c41585e8d54d6772e08',
    'Vintage Leather Backpack',
    'luggage_accessories',
    199.90,
    7,
    850,
    40,
    15,
    30,
    'olist'
),
(
    '87285b34884572b646c7b8e364c1b070',
    'Smart Audio Earbuds',
    'telephony',
    149.00,
    19,
    180,
    10,
    4,
    8,
    'olist'
),
(
    'b532349141c7b339dd82a04e5ec67d79',
    'Canvas Wall Art Print',
    'art',
    79.90,
    10,
    500,
    50,
    2,
    40,
    'olist'
),
(
    '4244733e06e7ecb49c540845c447469f',
    'Analog Precision Watch',
    'watches_gifts',
    320.00,
    5,
    220,
    12,
    6,
    10,
    'olist'
)
ON CONFLICT (product_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    category_name = EXCLUDED.category_name,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    weight_g = EXCLUDED.weight_g,
    length_cm = EXCLUDED.length_cm,
    height_cm = EXCLUDED.height_cm,
    width_cm = EXCLUDED.width_cm;
