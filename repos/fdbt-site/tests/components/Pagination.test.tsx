import { shallow } from 'enzyme';
import React from 'react';
import Pagination from '../../src/components/Pagination';

describe('Pagination', () => {
    it.each([
        [13, 121, 10],
        [1, 5, 10],
        [9, 27, 3],
    ])('should show %s pages, when there are %s results, with %s per page', (expectedPages, numResults, numPerPage) => {
        const wrapper = shallow(
            <Pagination
                currentPage={1}
                link="https://test.example.com"
                numberOfResults={numResults}
                numberPerPage={numPerPage}
            />,
        );

        expect(wrapper.find('.pagination-page')).toHaveLength(expectedPages);
    });

    it('should not show previous button if current page is 1', () => {
        const wrapper = shallow(
            <Pagination currentPage={1} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('li')
                .first()
                .text(),
        ).not.toBe('« Previous');
    });

    it('should show previous button if current page is not 1', () => {
        const wrapper = shallow(
            <Pagination currentPage={2} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('li')
                .first()
                .text(),
        ).toBe('« Previous');
    });

    it('should show correct previous link', () => {
        const wrapper = shallow(
            <Pagination currentPage={3} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('a')
                .first()
                .props().href,
        ).toBe('https://test.example.com?page=2');
    });

    it('should not show next button if current page is last page', () => {
        const wrapper = shallow(
            <Pagination currentPage={5} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('li')
                .last()
                .text(),
        ).not.toBe('Next »');
    });

    it('should show next button if current page is not last page', () => {
        const wrapper = shallow(
            <Pagination currentPage={1} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('li')
                .last()
                .text(),
        ).toBe('Next »');
    });

    it('should show correct next link', () => {
        const wrapper = shallow(
            <Pagination currentPage={3} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('a')
                .last()
                .props().href,
        ).toBe('https://test.example.com?page=4');
    });

    it('should mark current page as current', () => {
        const wrapper = shallow(
            <Pagination currentPage={5} link="https://test.example.com" numberOfResults={10} numberPerPage={2} />,
        );

        expect(
            wrapper
                .find('.current')
                .last()
                .text(),
        ).toBe('5');
    });
});
