import { expect } from 'chai';
import { keyBy, sortList, reducer, ON_DONE_CHANGE } from '../src/ducks/todo';

describe('Test Todo Reducers', function() {
  describe('keyBy', function() {
    it('key by should work properly', function() {
      const res = keyBy([
        {id: 1}, {id: 2}
      ], 'id')
      expect(res).to.deep.equal({
        1: {id: 1},
        2: {id: 2},
      })
    });
  });

  describe('sortList', function() {
    it('sort list should work properly', function() {
      const item = [
        { _id: 1, important: true, dueDate: '2019-01-13T12:00:00.000Z' },
        { _id: 2, important: false, dueDate: '2019-02-01T12:00:00.000Z' },
        { _id: 3, important: false, dueDate: '2019-01-01T12:00:00.000Z' },
        { _id: 4, important: true, dueDate: '2019-01-01T12:00:00.000Z' }
      ]
      const sorted = item.sort(sortList)
      expect(sorted).to.deep.equal([
        { _id: 4, important: true, dueDate: '2019-01-01T12:00:00.000Z' },
        { _id: 1, important: true, dueDate: '2019-01-13T12:00:00.000Z' },
        { _id: 3, important: false, dueDate: '2019-01-01T12:00:00.000Z' },
        { _id: 2, important: false, dueDate: '2019-02-01T12:00:00.000Z' },
      ])
    })
  })

  describe('reducers', function() {
    it('ON_DONE_CHANGE', function() {
      const state = {
        list: {
          '4':  { _id: 4, important: true, dueDate: '2019-01-01T12:00:00.000Z', done: true },
          '1':  { _id: 1, important: true, dueDate: '2019-01-13T12:00:00.000Z', done: false },
          '3':  { _id: 3, important: false, dueDate: '2019-01-01T12:00:00.000Z', done: false },
          '2':  { _id: 2, important: false, dueDate: '2019-02-01T12:00:00.000Z', done: false },
        }
      }
      const action = {
        type: ON_DONE_CHANGE,
        payload: { id: '3' }
      }
      const newState = reducer(state, action)
      expect(newState.list).to.deep.equal({
        '4':  { _id: 4, important: true, dueDate: '2019-01-01T12:00:00.000Z', done: true },
        '1':  { _id: 1, important: true, dueDate: '2019-01-13T12:00:00.000Z', done: false },
        '3':  { _id: 3, important: false, dueDate: '2019-01-01T12:00:00.000Z', done: true },
        '2':  { _id: 2, important: false, dueDate: '2019-02-01T12:00:00.000Z', done: false },
      })
    })
  })



});