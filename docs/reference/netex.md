# NeTEx

## Specification

[http://netex.uk/farexchange/doc/uk_profile/DfT-NeTEx-3-Fares_Spec-2019.06.17-v0.17.pdf](http://netex.uk/farexchange/doc/uk_profile/DfT-NeTEx-3-Fares_Spec-2019.06.17-v0.17.pdf)

## Nick Knowles examples

### Original Corrected Example

[FX-PI-01_UK_HCTY_LINE_FARE_Line-016-trip_2020-03-11T22_19_20.696Z.xml](../_attachments/reference/netex/FX-PI-01_UK_HCTY_LINE_FARE_Line-016-trip_2020-03-11T22_19_20.696Z.xml)

### Multi-operator Zonal

Here is a new example for a multi-operator zonal fare, the TravelMaster product for South Yorkshire, which illustrates common zonal tariff features but also has some interesting specific wrinkles.

- There are four zones Sheffield, Barnsley, Doncaster, Rotherham nested within a South Yorkshire Zone (See FARE ZONES) NB I haven't bothered to add all the stops but have marked as "ToDo".
- Passengers may also use Lines 271 and 272 up to the Sheffield border (See FARE SECTIONS)
- The main product gives access to one of the names zones (See PREASSIGNED FARE PRODUCT)
- There are different Sale Offers for bus only, bus + tram and bus/tram/rail combinations of mode (See SALE OFFER PACKAGEs.) Many of the packages share common features - to save repetition there is also a GROUP OF SALES PACKAGE for each TYPE OF DOCUMENT)
- The participating operators are listed. (See GROUPS OF OPERATORs)
- There are various durations available 1D, 1W, 4W, 1 Year. (See TIME INTERVALs)
- Tickets are aAvailable on paper, (1D only) mobile app (1D only) SmartCard (See TYPE OF TRAVEL DOCUMENT)
- There is a separate sales offer for young people 5-18 only for all zones. See SALLES OFFER PACKAGEs and USER PROFILEs
- There is a discount product for Youths 18-22 to buy the adult product (Represented as a SALE DISCOUNT RIGHT) with an additional set of prices.
- The smartcard product cost £1 and is a prerequisite for smartcard Offers (See AMOUNT OF PRICE UNIT)
- Prices may vary if bought onboard or off-vehicle (See GROUPS of DISTRIBUTION CHANNELs) . However, from the web site it is not clear whether the differences are inherent in the media used, or do actually vary . I have shown two alternative examples of Fare tables to demonstrate the two possible solutions depending on the answer.
- Not all combinations of duration, media, mode, etc are available for all zones

The example uses a single PREASSIGNED FARE PRODUCT with a number of different SALES OFFER PACKAGES, each corresponding to a Travel master "product" (Sheffield CityBus, Sheffield CityWIde, etc) and offering different combinations of, zone, operators, modes, durations and eligibility etc)

#### V1

[FX-PI-01_UK_TMSTR_NETWORK_FARE_Travelmaster-pass_20200315_v1.xml](../_attachments/reference/netex/FX-PI-01_UK_TMSTR_NETWORK_FARE_Travelmaster-pass_20200315_v1.xml)

#### V2

[FX-PI-01_UK_TMSTR_NETWORK_FARE_Travelmaster-pass_20200315_v2.xml](../_attachments/reference/netex/FX-PI-01_UK_TMSTR_NETWORK_FARE_Travelmaster-pass_20200315_v2.xml)

### Geographic Zone / Multiple Services Example

- This adds access rights to travel anywhere on the 271 & 272 routes to Castleton as offered by First on FirstPasses
- It also corrects a few small errors

[FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass_20200101.xml](../_attachments/reference/netex/FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass_20200101.xml)

#### By Period

[FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-by-period_20200310.xml](../_attachments/reference/netex/FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-by-period_20200310.xml)

#### By User

[FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-by-user_20200310.xml](../_attachments/reference/netex/FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-by-user_20200310.xml)

#### Simple

[FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-simple_20200310.xml](docs/_attachments/reference/netex/FX-PI-01_UK_FSYO_NETWORK_FARE_FirstSheffield-pass-simple_20200310.xml)

## Metrorider example

[FX-PI-01_UK_MB_NETWORK_FARE_Metrorider-pass_basic_20170101.xml](../_attachments/reference/netex/FX-PI-01_UK_MB_NETWORK_FARE_Metrorider-pass_basic_20170101.xml)

## Generated NeTEx examples

Example of the Single Trip NeTEx XML (incorporating NK’s changes of 11/03/20)

[single_trip_xml.json](../_attachments/reference/netex/single_trip_xml.json)

## Further Notes

Nick Knowles notes and advice on specific topics discussed during his first visit on 11th Feb:

[TfNFares-BriefNotes-v2.docx](docs/_attachments/reference/netex/TfNFares-BriefNotes-v2.docx)
