const ON_DONE_CHANGE = 'done_change'
const ON_IMPORTANT_CHANGE = 'important_change'
const ON_LOAD_MORE = 'load_more'


const sortList = (a, b) => (
  a.important !== b.important
    ? b.important - a.important
    : (new Date(a.dueDate)).getTime() - (new Date(b.dueDate)).getTime()
)

const keyBy = (arr, field) => {
  const jsonResult = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const v of arr) {
    // eslint-disable-next-line no-underscore-dangle
    jsonResult[v[field]] = v
  }
  return jsonResult
}


const toggleDone = (id, currentFlag) => async (dispatch) => {
  const params = new URLSearchParams()
  params.append('taskId', id)
  params.append('flag', !currentFlag)
  // eslint-disable-next-line no-undef
  const res = await fetch('https://muitsfriday-linebot-web.herokuapp.com/done', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  })
  const resJson = await res.json()
  dispatch({
    type: ON_DONE_CHANGE,
    payload: {
      id,
      res: resJson,
    },
  })
}

const toggleImportant = (id, currentFlag) => async (dispatch) => {
  const params = new URLSearchParams()
  params.append('taskId', id)
  params.append('flag', !currentFlag)
  // eslint-disable-next-line no-undef
  const res = await fetch('https://muitsfriday-linebot-web.herokuapp.com/important', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  })
  const resJson = await res.json()
  dispatch({
    type: ON_IMPORTANT_CHANGE,
    payload: {
      id,
      res: resJson,
    },
  })
}

const loadMore = () => async (dispatch, getState) => {
  const url = `https://muitsfriday-linebot-web.herokuapp.com/list?page=${getState().todo.page + 1}`
  // eslint-disable-next-line no-undef
  const res = await fetch(url)
  const resJson = await res.json()

  dispatch({
    type: ON_LOAD_MORE,
    payload: { list: resJson },
  })
}

const initialState = {
  page: 1,
  more: true,
  list: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_DONE_CHANGE: {
      const { id } = action.payload
      const list = { ...(state.list) }
      list[id].done = !list[id].done
      const s = { ...state, list }
      return s
    }
    case ON_IMPORTANT_CHANGE: {
      const { id } = action.payload
      const list = { ...(state.list) }
      list[id].important = !list[id].important
      const s = { ...state, list: keyBy(Object.values(list).sort(sortList), '_id') }
      return s
    }
    case ON_LOAD_MORE: {
      console.log(state, action)
      const s = {
        ...state,
        list: { ...(state.list), ...(action.payload.list) },
        page: state.page + 1,
        more: Object.keys(action.payload.list).length > 0,
      }
      return s
    }
    default: return state
  }
}

export {
  ON_DONE_CHANGE,
  reducer,
  toggleDone,
  toggleImportant,
  loadMore,
  sortList,
  keyBy,
}
