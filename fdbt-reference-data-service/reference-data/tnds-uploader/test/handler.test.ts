import { Context, Callback } from 'aws-lambda';
import MockContext from 'aws-lambda-mock-context';
import {s3hook, xmlParser} from '../../tnds-uploader/handler';

describe('aws handler', () =>{
    it('', async () =>{
        const xmlToParse = `<?xml version="1.0" encoding="utf-8"?>
        <TransXChange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.transxchange.org.uk/ http://www.transxchange.org.uk/schema/2.5/TransXChange_general.xsd" CreationDateTime="2019-11-26T10:18:00-00:00" ModificationDateTime="2019-11-26T10:18:00-00:00" Modification="new" RevisionNumber="0" FileName="SVRYHAO999.xml" SchemaVersion="2.5" RegistrationDocument="true" xmlns="http://www.transxchange.org.uk/">
        <StopPoints>
            <AnnotatedStopPointRef>
              <StopPointRef>2290YHA01586</StopPointRef>
              <CommonName>Hull Interchange</CommonName>
            </AnnotatedStopPointRef>
            <AnnotatedStopPointRef>
              <StopPointRef>2290YHA01512</StopPointRef>
              <CommonName>Carr Lane A</CommonName>
            </AnnotatedStopPointRef>
          </StopPoints>
          <RouteSections>
            <RouteSection id="YHAO999_001">
              <RouteLink id="YHAO999_001_28549">
                <From>
                  <StopPointRef>2290YHA01586</StopPointRef>
                </From>
                <To>
                  <StopPointRef>2290YHA01512</StopPointRef>
                </To>
                <Direction>outbound</Direction>
              </RouteLink>
            </RouteSection>
          </RouteSections>
          <Routes>
            <Route id="YHAO999_001">
              <Description>Hull Interchange - Monument Bridge
        </Description>
              <RouteSectionRef>YHAO999_001</RouteSectionRef>
            </Route>
          </Routes>
          <JourneyPatternSections>
            <JourneyPatternSection id="JPS_YHAO999-2">
              <JourneyPatternTimingLink id="JPS_YHAO999-2_28549">
                <From>
                  <StopPointRef>2290YHA01586</StopPointRef>
                  <TimingStatus>PTP</TimingStatus>
                </From>
                <To>
                  <StopPointRef>2290YHA01512</StopPointRef>
                  <TimingStatus>PTP</TimingStatus>
                </To>
                <RouteLinkRef>YHAO999_001_28549</RouteLinkRef>
                <Direction>outbound</Direction>
                <RunTime>PT300S</RunTime>
              </JourneyPatternTimingLink>
            </JourneyPatternSection>
          </JourneyPatternSections>
          <Operators>
            <Operator id="SCH">
              <NationalOperatorCode>CLTL</NationalOperatorCode>
              <OperatorCode>SCH</OperatorCode>
              <OperatorShortName>Stagecoach in Hull</OperatorShortName>
            </Operator>
          </Operators>
          <Services>
            <Service>
              <ServiceCode>YHAO999</ServiceCode>
              <Lines>
                <Line id="0">
                  <LineName>999</LineName>
                </Line>
              </Lines>
              <OperatingPeriod>
                <StartDate>2019-11-21</StartDate>
              </OperatingPeriod>
              <RegisteredOperatorRef>SCH</RegisteredOperatorRef>
              <StopRequirements>
                <NoNewStopsRequired />
              </StopRequirements>
              <Mode>bus</Mode>
              <Description>Hull Interchange - Monument Bridge</Description>
              <StandardService>
                <Origin>Hull Interchange</Origin>
                <Destination>Monument Bridge</Destination>
                <JourneyPattern id="JPS_YHAO999-2">
                  <Direction>outbound</Direction>
                  <JourneyPatternSectionRefs>JPS_YHAO999-2</JourneyPatternSectionRefs>
                </JourneyPattern>
              </StandardService>
            </Service>
          </Services>
          <VehicleJourneys>
            <VehicleJourney>
              <OperatorRef>SCH</OperatorRef>
              <OperatingProfile>
                <RegularDayType>
                  <DaysOfWeek>
                    <Monday />
                    <Tuesday />
                    <Wednesday />
                    <Thursday />
                    <Friday />
                    <Saturday />
                    <Sunday />
                  </DaysOfWeek>
                </RegularDayType>
                <BankHolidayOperation>
                  <DaysOfNonOperation>
                    <ChristmasDay />
                    <BoxingDay />
                    <NewYearsDay />
                  </DaysOfNonOperation>
                </BankHolidayOperation>
              </OperatingProfile>
              <VehicleJourneyCode>6139</VehicleJourneyCode>
              <ServiceRef>YHAO999</ServiceRef>
              <LineRef>0</LineRef>
              <JourneyPatternRef>JPS_YHAO999-2</JourneyPatternRef>
              <DepartureTime>15:00:00</DepartureTime>
            </VehicleJourney>
          </VehicleJourneys>
          <ADE></ADE>
        </TransXChange>`

        const result = await xmlParser(xmlToParse);

        console.log(result);

    })

    it('', () =>{

    })

    it('', () =>{

    })

    it('', () =>{

    })

    it('', () =>{

    })
});
