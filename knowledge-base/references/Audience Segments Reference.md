# Audience Segments Reference
Created: 2026-02-05
Updated: 2026-04-01

Support_ID: CHEATSHEET_6
Status: Done
Category: Audiences
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Bucket: Audiences
Domain: Audiences
Pillar: 7

## Purpose

Explains how Google Ads audience segments work: matching mechanics, intent temperature, availability by campaign type, data freshness, and segment behavior. Includes a full segment name lookup for all predefined categories.

---

## What this is / What this is NOT

**This reference:**

- Explains how Google matches users to each segment category
- Defines intent temperature and what it means for targeting quality
- Documents segment availability and behavior by campaign type
- Provides a full lookup of all predefined segment names

**This reference does NOT:**

- Provide strategy or stacking recommendations (See: [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md))
- Explain how to configure audience targeting (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- Cover system specs, targeting modes, or expansion features (See: [Audience Targeting Reference](../references/Audience Targeting Reference.md))
- Cover Performance Max signal configuration (See: [Audience Signals Reference](../references/Audience Signals Reference.md))

---

## Quick reference: Segment categories

| Category | How Google matches | Temperature | Approx. segments | Campaign availability |
|----------|-------------------|-------------|------------------|----------------------|
| Basic Demographics | Self-reported + inferred from browsing/search patterns | Layer only (refines, not targets) | ~20 options | All campaign types |
| Detailed Demographics | Cross-referenced from browsing, search, and life stage signals | Layer only (refines, not targets) | ~25 segments | All campaign types |
| Affinity Audiences | Long-term browsing patterns, content consumption, lifestyle signals | Cold (broad interest, no purchase intent) | ~130 segments | Display, Video, Demand Gen, PMax (signal) |
| In-Market Audiences | Active research behavior: recent searches, site visits, content engagement | Cool (active consideration, higher intent than Affinity) | ~500+ segments | Display, Video, Demand Gen, PMax (signal) |
| Life Events | Behavioral signals indicating major life transitions | Cool (intent varies by event proximity) | ~15 events | Display, Video, Demand Gen |
| Custom Segments | Keywords, URLs, or apps you define | Varies by input quality | Unlimited | Display, Video, Demand Gen, PMax (signal) |
| Your Data (Remarketing) | Direct interaction: site visits, app usage, video views | Warm to hot (based on recency) | Unlimited | All campaign types |
| Customer Match | First-party CRM data matched to Google accounts | Hot (known customers/leads) | Unlimited | All campaign types |

---

## Segment mechanics

### How matching works

Google assigns users to predefined segments based on observed behavior. The assignment is probabilistic, not deterministic.

| Category | Matching signal | Refresh frequency | Decay behavior |
|----------|----------------|-------------------|----------------|
| **Basic Demographics** | Google account data + inferred signals | Continuous | Does not decay (age, gender are stable) |
| **Detailed Demographics** | Cross-referenced browsing, search, life stage | Weekly to monthly | Slow decay (life stages change over months/years) |
| **Affinity** | 30+ days of consistent browsing behavior | Ongoing | Slow decay (interests persist for months) |
| **In-Market** | Active research in the last 7-14 days | Rolling | Fast decay (users exit the segment when research stops) |
| **Life Events** | Behavioral patterns indicating transition | Event-driven | Exits after event passes (weeks to months) |
| **Custom Segments** | Matches user search/browse behavior to your keywords/URLs | Rolling | Depends on input recency: keyword searches decay in 7-14 days |
| **Your Data** | Tag-based (site visit, video view, app action) | Real-time | Membership duration you set (default varies by type) |
| **Customer Match** | Email/phone/address matched to Google accounts | At upload + periodic re-match | Does not decay until you remove from list |

### Intent temperature explained

Temperature reflects how close a user is to a conversion action. It determines expected CPA and appropriate campaign goals.

| Temperature | Segment types | Expected behavior | Typical CPA relative to Non-Branded Search |
|-------------|--------------|-------------------|-------------------------------------------|
| **Hot** | Customer Match, recent converters, cart abandoners | High conversion rate, low reach | 1.5-2x Non-Branded Search CPA |
| **Warm** | Site visitors (7-30 days), YouTube viewers | Moderate conversion rate, moderate reach | 2-2.5x Non-Branded Search CPA |
| **Cool** | In-Market, Life Events, custom segments (keyword) | Lower conversion rate, broader reach | 2.5-3x Non-Branded Search CPA |
| **Cold** | Affinity, broad custom segments (URL/app) | Lowest conversion rate, highest reach | 3-4x Non-Branded Search CPA |

### Segment availability by campaign type

| Segment type | Search | Shopping | PMax | Display | Video | Demand Gen |
|-------------|--------|----------|------|---------|-------|------------|
| Basic Demographics | Observation only | Observation only | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Detailed Demographics | Observation only | Observation only | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Affinity | Observation only | Observation only | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| In-Market | Observation only | Observation only | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Life Events | ❌ | ❌ | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Custom Segments | ❌ | ❌ | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Your Data (Remarketing) | RLSA (Observation/Targeting) | ❌ | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Customer Match | RLSA (Observation/Targeting) | ❌ | Signal | Targeting/Observation | Targeting/Observation | Targeting |
| Lookalike Segments | ❌ | ❌ | ❌ | ❌ | ❌ | Targeting |
| Combined Segments | Observation only | ❌ | Signal | Targeting/Observation | Targeting/Observation | Targeting |

> 💡 **Key distinction.** In Search/Shopping, audience segments function as observation layers (bid modifiers) or RLSA targeting. In Display/Video/Demand Gen, they control who sees your ads. In PMax, they function as signals (hints to the algorithm).

### The "Unknown" segment

Every demographic dimension includes an "Unknown" category representing users Google cannot classify. This segment typically contains 20-40% of traffic.

- Do not exclude "Unknown" without 30+ days of data showing CPA > 2x campaign average
- "Unknown" often contains high-quality users whose demographics are simply undetected
- Excluding "Unknown" reduces reach by 20-40% with uncertain performance impact

---

## Full segment name lookup

The tables below list all predefined Google Ads segment names. Use the [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) for configuration examples and strategy per segment type.

## Basic Demographics

| Age | Gender | Household Income | Parental Status |
|-----|--------|------------------|-----------------|
| 18-24 | Female | Top 10% | Not a parent |
| 25-34 | Male | 11-20% | Parent |
| 35-44 | Unknown | 21-30% | Unknown |
| 45-54 | | 31-40% | |
| 55-64 | | 41-50% | |
| 65+ | | Lower 50% | |
| Unknown | | Unknown | |

---

## Detailed Demographics

### Education

| Segment | Detail |
|---------|--------|
| Current College Students | Currently enrolled |
| Highest Level: Advanced Degree | Graduate/professional degree holders |
| Highest Level: Bachelor's Degree | Undergraduate degree holders |
| Highest Level: High School Graduate | High school diploma holders |

### Employment

| Category | Segment |
|----------|---------|
| Company Size | Large Employer (250-10k Employees) |
| Company Size | Small Employer (1-249 Employees) |
| Company Size | Very Large Employer (10k+ Employees) |
| Industry | Construction Industry |
| Industry | Education Sector |
| Industry | Financial Industry |
| Industry | Healthcare Industry |
| Industry | Hospitality Industry |
| Industry | Manufacturing Industry |
| Industry | Real Estate Industry |
| Industry | Technology Industry |

### Homeownership Status

| Segment |
|---------|
| Homeowners |
| Renters |

### Marital Status

| Segment |
|---------|
| In a Relationship |
| Married |
| Single |

### Parental Status (Detailed)

| Segment | Age Range |
|---------|-----------|
| Parents of Infants | 0-1 years |
| Parents of Toddlers | 1-3 years |
| Parents of Preschoolers | 4-5 years |
| Parents of Grade-Schoolers | 6-12 years |
| Parents of Teens | 13-17 years |

---

## Affinity Audiences

### Banking & Finance

| Segment |
|---------|
| Avid Investors |
| Banks Online |

### Beauty & Wellness

| Segment |
|---------|
| Beauty Mavens |
| Frequently Visits Salons |

### Food & Dining

| Category | Subcategory | Segment |
|----------|------------|---------|
| Top-level | | Coffee Shop Regulars |
| Top-level | | Fast Food Cravers |
| Top-level | | Foodies |
| Top-level | | Prefers Organic Food |
| Cooking Enthusiasts | | 30 Minute Chefs |
| Cooking Enthusiasts | | Aspiring Chefs |
| Frequently Dines Out | Diners by Meal | Frequently Eats Breakfast Out |
| Frequently Dines Out | Diners by Meal | Frequently Eats Dinner Out |
| Frequently Dines Out | Diners by Meal | Frequently Eats Lunch Out |
| Vegetarians & Vegans | | Vegetarians & Vegans |
| Vegetarians & Vegans | | Vegans |

### Home & Garden

| Segment |
|---------|
| Do-It-Yourselfers |
| Home Decor Enthusiasts |

### Lifestyles & Hobbies

| Category | Segment |
|----------|---------|
| Top-level | Art & Theater Aficionados |
| Top-level | Business Professionals |
| Top-level | Charitable Donors & Volunteers |
| Top-level | Fashionistas |
| Top-level | Frequently Attends Live Events |
| Top-level | Green Living Enthusiasts |
| Top-level | Nightlife Enthusiasts |
| Top-level | Outdoor Enthusiasts |
| Top-level | Shutterbugs |
| Top-level | Thrill Seekers |
| Family-Focused | Homeschooling Parents |
| Pet Lovers | Cat Lovers |
| Pet Lovers | Dog Lovers |

### Media & Entertainment

| Category | Segment |
|----------|---------|
| Top-level | Book Lovers |
| Top-level | Comics & Animation Fans |
| Top-level | Light TV Viewers |
| Gamers | Action Game Fans |
| Gamers | Adventure & Strategy Game Fans |
| Gamers | Casual & Social Gamers |
| Gamers | Console Gamers |
| Gamers | Driving & Racing Game Fans |
| Gamers | Esports Fans |
| Gamers | Fans of New & Upcoming Video Games |
| Gamers | Hardcore Gamers |
| Gamers | PC Gamers |
| Gamers | Roleplaying Game Fans |
| Gamers | Shooter Game Fans |
| Gamers | Sports Game Fans |
| Movie Lovers | Action & Adventure Movie Fans |
| Movie Lovers | Comedy Movie Fans |
| Movie Lovers | Family Movie Fans |
| Movie Lovers | Fans of New & Upcoming Movies |
| Movie Lovers | Horror Movie Fans |
| Movie Lovers | Romance & Drama Movie Fans |
| Movie Lovers | Sci-Fi & Fantasy Movie Fans |
| Movie Lovers | South Asian Film Fans |
| Music Lovers | Blues Fans |
| Music Lovers | Classical Music Enthusiasts |
| Music Lovers | Country Music Fans |
| Music Lovers | Electronic Dance Music Fans |
| Music Lovers | Folk & Traditional Music Enthusiasts |
| Music Lovers | Indie & Alternative Rock Fans |
| Music Lovers | Jazz Enthusiasts |
| Music Lovers | Metalheads |
| Music Lovers | Pop Music Fans |
| Music Lovers | Rap & Hip Hop Fans |
| Music Lovers | Rock Music Fans |
| Music Lovers | Spanish-Language Music Fans |
| Music Lovers | World Music Fans |
| TV Lovers | Documentary & Nonfiction TV Fans |
| TV Lovers | Family Television Fans |
| TV Lovers | Game, Reality & Talk Show Fans |
| TV Lovers | Sci-Fi & Fantasy TV Fans |
| TV Lovers | TV Comedy Fans |
| TV Lovers | TV Drama Fans |

### News & Politics

| Category | Segment |
|----------|---------|
| Avid News Readers | Avid Business News Readers |
| Avid News Readers | Avid Local News Readers |
| Avid News Readers | Avid Political News Readers |
| Avid News Readers | Avid World News Readers |
| Avid News Readers | Entertainment News Enthusiasts |
| Avid News Readers | Men's Media Fans |
| Avid News Readers | Women's Media Fans |

### Shoppers

| Category | Segment |
|----------|---------|
| Top-level | Bargain Hunters |
| Top-level | Luxury Shoppers |
| Top-level | Shopaholics |
| Top-level | Value Shoppers |
| Shoppers by Store Type | Convenience Store Shoppers |
| Shoppers by Store Type | Department Store Shoppers |
| Shoppers by Store Type | Grocery Shoppers |
| Shoppers by Store Type | Superstore Shoppers |

### Sports & Fitness

| Category | Segment |
|----------|---------|
| Health & Fitness Buffs | Weightlifters |
| Health & Fitness Buffs | Yoga Lovers |
| Sports Fans | American Football Fans |
| Sports Fans | Australian Football Fans |
| Sports Fans | Baseball Fans |
| Sports Fans | Basketball Fans |
| Sports Fans | Boating & Sailing Enthusiasts |
| Sports Fans | Cricket Enthusiasts |
| Sports Fans | Cycling Enthusiasts |
| Sports Fans | Fight & Wrestling Fans |
| Sports Fans | Golf Enthusiasts |
| Sports Fans | Hockey Fans |
| Sports Fans | Motor Sports Enthusiasts |
| Sports Fans | Racquetball Enthusiasts |
| Sports Fans | Rugby Enthusiasts |
| Sports Fans | Running Enthusiasts |
| Sports Fans | Skiing Enthusiasts |
| Sports Fans | Soccer Fans |
| Sports Fans | Swimming Enthusiasts |
| Sports Fans | Tennis Enthusiasts |
| Sports Fans | Water Sports Enthusiasts |
| Sports Fans | Winter Sports Enthusiasts |

### Technology

| Category | Segment |
|----------|---------|
| Top-level | Mobile Enthusiasts |
| Top-level | Social Media Enthusiasts |
| Technophiles | Audiophiles |
| Technophiles | Cloud Services Power Users |
| Technophiles | High-End Computer Aficionados |
| Technophiles | Home Automation Enthusiasts |

### Travel

| Category | Segment |
|----------|---------|
| Top-level | Business Travelers |
| Travel Buffs | Beachbound Travelers |
| Travel Buffs | Family Vacationers |
| Travel Buffs | Luxury Travelers |
| Travel Buffs | Snowbound Travelers |

### Vehicles & Transportation

| Category | Segment |
|----------|---------|
| Auto Enthusiasts | Motorcycle Enthusiasts |
| Auto Enthusiasts | Performance & Luxury Vehicle Enthusiasts |
| Auto Enthusiasts | Truck & SUV Enthusiasts |
| Transportation Modes | Public Transit Users |
| Transportation Modes | Taxi Service Users |

---

## In-Market Audiences

### Apparel & Accessories

| Category | Subcategory | Segment |
|----------|------------|---------|
| Activewear | | Running Apparel |
| Activewear | | Yoga Apparel |
| Top-level | | Backpacks |
| Top-level | | Costumes |
| Top-level | | Handbags |
| Top-level | | Hats |
| Top-level | | Lingerie |
| Top-level | | Luggage |
| Top-level | | Men's Apparel |
| Top-level | | Outerwear |
| Top-level | | Pants |
| Top-level | | Shirts & Tops |
| Top-level | | Socks |
| Top-level | | Swimwear |
| Top-level | | Underwear |
| Top-level | | Wallets, Briefcases & Leather Goods |
| Top-level | | Women's Apparel |
| Eyewear | | Eyeglasses & Contact Lenses |
| Eyewear | | Sunglasses |
| Formal Wear | | Bridal Wear |
| Formal Wear | | Suits & Business Attire |
| Jewelry & Watches | | Fine Jewelry > Necklaces |
| Jewelry & Watches | | Watches |
| Jewelry & Watches | | Wedding & Engagement Rings |
| Shoes | | Athletic Shoes |
| Shoes | | Boots |
| Shoes | | Dress Shoes |

### Arts & Crafts Supplies

| Segment |
|---------|
| Arts & Crafts Supplies |

### Autos & Vehicles

**Auto Parts & Accessories**

| Segment |
|---------|
| Auto Exterior Parts & Accessories |
| Auto Interior Parts & Accessories |
| Automotive Electronic Components |
| Car Batteries |
| Car Brakes |
| Engine & Transmission |
| High Performance & Aftermarket Auto Parts |
| Wheels & Tires |

**Auto Repair & Maintenance**

| Segment |
|---------|
| Brake Service & Repair |
| Collision & Auto Body Repair |
| Glass Repair & Replacement |
| Oil Changes |
| Transmission Repair |

**Motor Vehicles**

| Category | Segment |
|----------|---------|
| Top-level | Motor Vehicles (New) |
| Top-level | Motor Vehicles (Used) |
| By Brand | Acura |
| By Brand | Alfa Romeo |
| By Brand | Audi |
| By Brand | BMW |
| By Brand | Buick |
| By Brand | Cadillac |
| By Brand | Chevrolet |
| By Brand | Chrysler |
| By Brand | Citroen |
| By Brand | Dodge |
| By Brand | Fiat |
| By Brand | Ford |
| By Brand | GMC |
| By Brand | Honda |
| By Brand | Hyundai |
| By Brand | Infiniti |
| By Brand | Isuzu |
| By Brand | Jaguar |
| By Brand | Jeep |
| By Brand | Kia |
| By Brand | Land Rover |
| By Brand | Lexus |
| By Brand | Lincoln |
| By Brand | Maserati |
| By Brand | Mazda |
| By Brand | Mercedes-Benz |
| By Brand | Mini |
| By Brand | Mitsubishi |
| By Brand | Nissan |
| By Brand | Peugeot |
| By Brand | Porsche |
| By Brand | Ram |
| By Brand | Renault |
| By Brand | Subaru |
| By Brand | Suzuki |
| By Brand | Tesla |
| By Brand | Toyota |
| By Brand | Volkswagen |
| By Brand | Volvo |
| By Type | Convertibles |
| By Type | Coupes |
| By Type | Crossovers |
| By Type | Hatchbacks |
| By Type | Luxury Vehicles |
| By Type | Minivans & Vans |
| By Type | Motorcycles |
| By Type | Off-Road Vehicles |
| By Type | Pickup Trucks |
| By Type | Scooters & Mopeds |
| By Type | Sedans |
| By Type | Station Wagons |
| By Type | SUVs |

### Baby & Children's Products

| Category | Segment |
|----------|---------|
| Top-level | Baby & Toddler Feeding Products |
| Top-level | Baby Bathing Products |
| Top-level | Baby Safety Products |
| Top-level | Changing Products |
| Top-level | Children's Furniture |
| Top-level | Children's Toys |
| Top-level | Diapers |
| Baby Transport | Baby Carriers |
| Baby Transport | Strollers |

### Beauty Products & Services

| Category | Subcategory | Segment |
|----------|------------|---------|
| Top-level | | Cosmetics |
| Top-level | | Fragrances & Perfumes |
| Bath & Body Products | | Bar Soap |
| Bath & Body Products | | Body Wash |
| Beauty Services | | Hair Care Services |
| Beauty Services | | Spa Services |
| Hair Care | | Hair Color Products |
| Hair Care | | Shampoo & Conditioner |
| Hair Care | | Styling Products |
| Skin Care Products | | Anti-Aging Products |
| Skin Care Products | | Facial Cleansers |
| Skin Care Products | | Moisturizers |

### Business Services

| Category | Segment |
|----------|---------|
| Top-level | Corporate Event Planning |
| Top-level | Legal Services |
| Top-level | Office Supplies |
| Top-level | Payroll Services |
| Top-level | Staffing Services |
| Advertising & Marketing | Branding & Promotional Products |
| Advertising & Marketing | Design Services |
| Advertising & Marketing | Digital Marketing Services |
| Advertising & Marketing | Print & Direct Mail Services |
| Advertising & Marketing | SEO & SEM Services |
| Advertising & Marketing | Social Media Marketing Services |
| Business Financial Services | Merchant Services |
| Business Printing | Business Printing & Document Services |
| Business Technology | CRM Software |
| Business Technology | Enterprise Software |
| Business Technology | HR & Payroll Software |
| Business Technology | Marketing Automation |
| Business Technology | Project Management Software |
| Business Technology | Web Hosting Services |

### Computers & Peripherals

| Category | Segment |
|----------|---------|
| Top-level | Computer Monitors |
| Top-level | Networking Devices |
| Top-level | Printers, Copiers & Fax Machines |
| Top-level | Projectors |
| Top-level | Scanners |
| Computers | Desktop Computers |
| Computers | Laptops & Notebooks |
| Computers | Tablets |

### Consumer Electronics

| Category | Subcategory | Segment |
|----------|------------|---------|
| Audio | | Headphones |
| Audio | | Home Audio |
| Audio | | Portable Speakers |
| Cameras | | Camcorders & Video Cameras |
| Cameras | | Digital Cameras |
| Top-level | | GPS & Navigation Systems |
| Top-level | | Home Theater Systems |
| Top-level | | Smart Watches |
| Mobile Phones | | Mobile Phone Accessories |
| Mobile Phones | By Brand | Apple iPhone |
| Mobile Phones | By Brand | Google Pixel |
| Mobile Phones | By Brand | Samsung Galaxy |
| TVs | | Flat Panel TVs |
| TVs | | Smart TVs |
| Video Game Consoles | By Brand | PlayStation |
| Video Game Consoles | By Brand | Xbox |

### Consumer Software

| Segment |
|---------|
| Antivirus & Security Software |
| Business & Productivity Software |
| Photo & Video Editing Software |

### Dating Services

| Segment |
|---------|
| Dating Services |

### Education

| Category | Segment |
|----------|---------|
| Top-level | Foreign Language Learning |
| Post-Secondary Education | Colleges & Universities |
| Post-Secondary Education | Exams & Standardized Tests |
| Primary & Secondary Schools | Private Schools |

### Employment

| Segment |
|---------|
| Accounting & Finance Jobs |
| Admin & Clerical Jobs |
| Career Development > Resume & Portfolio Services |
| Customer Service Jobs |
| Education Jobs |
| Government & Public Sector Jobs |
| Healthcare Jobs |
| Hospitality & Tourism Jobs |
| IT & Technical Jobs |
| Legal Jobs |
| Manufacturing & Warehouse Jobs |
| Marketing Jobs |
| Real Estate Jobs |
| Retail Jobs |
| Sales Jobs |
| Scientific & Engineering Jobs |
| Skilled Trade & Labor Jobs |

### Financial Services

| Category | Subcategory | Segment |
|----------|------------|---------|
| Banking Services | | Checking Accounts |
| Banking Services | | Savings Accounts |
| Credit & Lending | | Auto Loans |
| Credit & Lending | | Business Loans |
| Credit & Lending | | Credit Cards |
| Credit & Lending | | Debt Management & Counseling |
| Credit & Lending | | Home Equity |
| Credit & Lending | | Personal Loans |
| Credit & Lending | | Student Loans |
| Credit & Lending | Mortgage Loans | Mortgage Refinancing |
| Financial Planning | | Retirement Planning |
| Insurance | | Auto Insurance |
| Insurance | | Health Insurance |
| Insurance | | Home Insurance |
| Insurance | | Life Insurance |
| Insurance | | Travel Insurance |
| Investment Services | | Brokerage & Day Trading |
| Top-level | | Tax Services |

### Food & Groceries

| Category | Segment |
|----------|---------|
| Top-level | Cooking Ingredients |
| Top-level | Food Delivery & Takeout |
| Top-level | Meal Kits |
| Prepared Foods | Frozen Meals |
| Prepared Foods | Prepared Meals & Side Dishes |

### Gifts & Occasions

| Segment |
|---------|
| Cards & Greetings |
| Flowers |
| Gift Baskets |
| Party & Holiday Supplies |
| Personalized Gifts |

### Health

| Category | Subcategory | Segment |
|----------|------------|---------|
| Top-level | | Chiropractic Services |
| Top-level | | Dental Care |
| Top-level | | Mental Health Services |
| Top-level | | Pharmacies |
| Top-level | | Physical Therapy |
| Top-level | | Substance Abuse Treatments |
| Top-level | | Vision Care |
| Health Conditions | | Allergies |
| Health Conditions | | Arthritis |
| Health Conditions | | Diabetes Management |
| Health Conditions | | Heart Disease |
| Health Conditions | | Sleep Disorders |
| Medical Devices | | Diabetes Management Equipment |
| Medical Devices | | Hearing Aids |
| Medical Devices | | Mobility & Accessibility Equipment |
| Weight Loss | | Weight Loss Programs |
| Weight Loss | | Weight Loss Supplements |
| Wellness Products | | Herbal & Natural Remedies |
| Wellness Products | | Vitamins & Supplements |

### Home & Garden

| Category | Subcategory | Segment |
|----------|------------|---------|
| Top-level | | Bathroom |
| Top-level | | Fireplace Products |
| Top-level | | Home Security |
| Top-level | | Pest Control |
| Top-level | | Tools |
| Bed & Bath | | Bath Products |
| Bed & Bath | | Bedding & Linens |
| Home Appliances | | Dishwashers |
| Home Appliances | | Laundry Appliances |
| Home Appliances | | Refrigerators & Freezers |
| Home Appliances | | Small Kitchen Appliances |
| Home Appliances | | Vacuum Cleaners |
| Home Decor | | Clocks |
| Home Decor | | Home Fragrance |
| Home Decor | | Lamps & Lighting |
| Home Decor | | Rugs & Carpets |
| Home Decor | | Wall Art |
| Home Decor | | Window Treatments |
| Home Furnishings | | Bedroom Furniture |
| Home Furnishings | | Living Room Furniture |
| Home Furnishings | | Office Furniture |
| Home Furnishings | | Outdoor Furniture |
| Home Improvement | | Cabinets & Countertops |
| Home Improvement | | Doors & Windows |
| Home Improvement | | Flooring |
| Home Improvement | | Home Exterior |
| Home Improvement | | Home Heating & Cooling |
| Home Improvement | | HVAC & Climate Control |
| Home Improvement | | Kitchen Remodeling |
| Home Improvement | | Paint & Wallpaper |
| Home Improvement | | Plumbing |
| Home Improvement | | Roofing |
| Housekeeping | | Cleaning Products |
| Housekeeping | | Organization & Storage Products |
| Kitchen & Dining | | Cookware |
| Kitchen & Dining | | Kitchen Storage |
| Kitchen & Dining | | Small Kitchen Appliances |
| Kitchen & Dining | | Tableware |
| Outdoor & Garden | | Garden Accessories |
| Outdoor & Garden | | Gardening |
| Outdoor & Garden | | Grills & Outdoor Cooking |
| Outdoor & Garden | | Lawn Care & Power Equipment |
| Outdoor & Garden | | Outdoor Power Equipment |
| Outdoor & Garden | | Outdoor Storage |
| Outdoor & Garden | | Pools & Spas |

### Real Estate

| Category | Segment |
|----------|---------|
| Top-level | Commercial Property |
| Top-level | Property Management |
| Top-level | Residential Property (To Buy) |
| Top-level | Residential Property (To Rent) |
| Residential Property | Apartments |
| Residential Property | Houses |
| Residential Property | Vacation & Leisure Property |

### Sports & Fitness

| Category | Subcategory | Segment |
|----------|------------|---------|
| Exercise & Fitness | | Fitness Equipment |
| Exercise & Fitness | | Fitness Programs & Products |
| Exercise & Fitness | | Gym Memberships |
| Outdoor Recreation | | Bike Accessories |
| Outdoor Recreation | | Bikes |
| Outdoor Recreation | | Camping & Hiking Gear |
| Outdoor Recreation | | Climbing Equipment |
| Outdoor Recreation | | Fishing Equipment |
| Outdoor Recreation | | Hunting & Shooting Equipment |
| Outdoor Recreation | | Water Sports Equipment |
| Sporting Goods | | Golf Equipment |
| Sporting Goods | | Racquet Sport Equipment |
| Sporting Goods | | Winter Sports Equipment |
| Top-level | | Sports Apparel |
| Team Sports Equipment | | Baseball & Softball Equipment |
| Team Sports Equipment | | Basketball Equipment |
| Team Sports Equipment | | Football Equipment |
| Team Sports Equipment | | Soccer Equipment |

### Telecom

| Category | Segment |
|----------|---------|
| Top-level | Cable & Satellite TV Providers |
| Top-level | Internet Service Providers |
| Mobile Phone Service | AT&T |
| Mobile Phone Service | Sprint |
| Mobile Phone Service | T-Mobile |
| Mobile Phone Service | Verizon |

### Travel

| Category | Subcategory | Segment |
|----------|------------|---------|
| Top-level | | Air Travel |
| Top-level | | Bus & Rail Travel |
| Top-level | | Cruises & Charters |
| Top-level | | Luggage & Travel Accessories |
| Top-level | | Vacation Packages |
| Car Rental & Taxi | | Car Rental |
| Car Rental & Taxi | | Ridesharing & Taxi Services |
| Hotels & Accommodations | | Extended Stay & Vacation Rentals |
| Hotels & Accommodations | | Hotels & Resorts |

**Trips by Destination: Asia Pacific**

| Country/Region | City/Area |
|---------------|-----------|
| Australia | Brisbane, Melbourne, Perth, Sydney |
| Bali | |
| Bangkok | |
| Cambodia | |
| China | Beijing, Guangzhou, Hong Kong, Shanghai |
| Fiji | |
| India | Bangalore, Chennai, Delhi, Goa, Hyderabad, Jaipur, Kerala, Kolkata, Mumbai, Pune |
| Indonesia | Jakarta |
| Japan | Fukuoka, Hokkaido, Kyoto, Osaka, Tokyo |
| Malaysia | Kuala Lumpur |
| Maldives | |
| Nepal | |
| New Zealand | Auckland, Queenstown |
| Palawan | |
| Philippines | Cebu, Manila |
| Singapore | |
| South Korea | Busan, Jeju Island, Seoul |
| Sri Lanka | |
| Taiwan | Taipei |
| Thailand | Chiang Mai, Pattaya, Phuket |
| Vietnam | Da Nang, Hanoi, Ho Chi Minh City |

**Trips by Destination: Central & South America**

| Country/Region | City/Area |
|---------------|-----------|
| Argentina | Buenos Aires |
| Bogota | |
| Brazil | Rio de Janeiro, Sao Paulo |
| Caribbean Islands | Aruba, Bahamas, Barbados, Cancun & Mayan Riviera, Cayman Islands, Cuba, Dominican Republic (Punta Cana, Santo Domingo), Jamaica, Puerto Rico, St. Martin, Trinidad & Tobago, Turks & Caicos, Virgin Islands |
| Chile | Santiago |
| Colombia | Cartagena, Medellin |
| Costa Rica | |
| Ecuador | Galapagos Islands |
| Guatemala | |
| Lima | |
| Mexico | Guadalajara, Los Cabos, Mexico City, Monterrey, Puerto Vallarta |
| Nicaragua | |
| Panama | Panama City |
| Peru | Cusco |
| Uruguay | |

**Trips by Destination: Europe**

| Country/Region | City/Area |
|---------------|-----------|
| Albania | |
| Austria | Salzburg, Vienna |
| Belgium | Brussels |
| Bosnia & Herzegovina | |
| Bulgaria | |
| Croatia | Dubrovnik, Split, Zagreb |
| Cyprus | |
| Czech Republic | Prague |
| Denmark | Copenhagen |
| Estonia | |
| Finland | Helsinki |
| France | Bordeaux, Lyon, Marseille, Nice, Paris, Provence, Strasbourg |
| Germany | Berlin, Cologne, Dusseldorf, Frankfurt, Hamburg, Munich, Stuttgart |
| Greece | Athens, Crete, Greek Islands, Mykonos, Santorini, Thessaloniki |
| Hungary | Budapest |
| Iceland | Reykjavik |
| Ireland | Dublin |
| Italy | Amalfi Coast, Bologna, Florence, Milan, Naples, Rome, Sardinia, Sicily, Turin, Venice |
| Latvia | |
| Lithuania | |
| Luxembourg | |
| Malta | |
| Monaco | |
| Montenegro | |
| Netherlands | Amsterdam, Rotterdam |
| Norway | Bergen, Oslo |
| Poland | Krakow, Warsaw |
| Portugal | Algarve, Lisbon, Porto |
| Romania | Bucharest |
| Russia | Moscow, St. Petersburg |
| Scotland | Edinburgh, Glasgow |
| Serbia | |
| Slovakia | |
| Slovenia | |
| Spain | Balearic Islands, Barcelona, Bilbao, Canary Islands, Madrid, Malaga & Costa Del Sol, San Sebastian, Seville, Valencia |
| Sweden | Gothenburg, Malmo, Stockholm |
| Switzerland | Geneva, Zurich |
| Turkey | Antalya, Istanbul |
| UK | Birmingham, Liverpool, London, Manchester |
| Ukraine | |

**Trips by Destination: North America**

| Country/Region | City/Area |
|---------------|-----------|
| Bermuda | |
| Canada | Calgary, Edmonton, Halifax, Montreal, Niagara Falls, Ottawa, Quebec City, Toronto, Vancouver, Victoria, Whistler, Winnipeg |
| US: California | Los Angeles, Orange County, San Diego, San Francisco Bay Area |
| US: Florida | Fort Lauderdale, Fort Myers, Jacksonville, Key West, Miami, Orlando, Pensacola, Tampa Bay Area |
| US: Hawaii | Maui, Oahu, the Big Island |
| US: Other cities | Albuquerque, Asheville, Atlanta, Atlantic City, Austin, Baltimore, Boston, Branson, Buffalo-Niagara Area, Charleston SC, Charlotte, Chicago, Cincinnati, Cleveland, Columbus, Dallas-Fort Worth, Denver, Detroit, Gatlinburg, Greenville SC, Hartford, Houston, Indianapolis, Kansas City, Las Vegas, Little Rock, Louisville, Memphis, Milwaukee, Minneapolis-Saint Paul, Myrtle Beach & Grand Strand, Nashville, New Orleans, New York City, Norfolk-Virginia Beach Region, Ocean City MD, Oklahoma City, Omaha, Philadelphia, Phoenix, Pittsburgh, Portland OR, Raleigh-Durham Area, Reno, Richmond VA, Salt Lake City, San Antonio, Savannah, Seattle, St. Louis, Tucson, Washington D.C. |

**Trips by Destination: Middle East & Africa**

| Country/Region | City/Area |
|---------------|-----------|
| Doha | |
| Egypt | |
| Israel | |
| Jeddah | |
| Jordan | |
| Kenya | |
| Kuwait | |
| Lebanon | |
| Morocco | |
| Riyadh | |
| South Africa | Cape Town, Johannesburg |
| Tehran | |
| United Arab Emirates | Abu Dhabi, Dubai |

---

## Related documents

| Document | Type | Relationship |
|----------|------|-------------|
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Catalog | Configuration guidance for Display, Video, Demand Gen segments |
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Catalog | Configuration guidance for PMax audience signals |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | System specs, targeting modes, limits |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | PMax signal types and configuration |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Signals vs. targeting conceptual framework |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Checklist | Validates targeting setup |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Checklist | Validates ongoing targeting health |
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Checklist | Validates signal setup |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | SOP | Step-by-step targeting configuration |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

(c) 2026 PPC Mastery B.V. All rights reserved.
