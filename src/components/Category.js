// hooks
import { useContext } from "react"
import { useHistory, useParams } from "react-router-dom"
// antd
import { Result, Button } from "antd"
// constants
import { db } from "constant/firebase"
import { CATEGORIES, SPREADSHEET_KEY } from "constant/static"
// context
import { StateContext } from "context/StateContext"
// helper
import { toTitleCase } from "utils/caseHelper"
// components
import Loader from "components/Loader"
import Table from "components/Table"
// icons
import { ReactComponent as UpvoteIcon } from "assets/icons/upvote.svg"
import { ReactComponent as DownvoteIcon } from "assets/icons/downvote.svg"

const COLUMNS = [
  {
    title: "State",
    dataIndex: "State",
    key: "State",
  },
  {
    title: "Distributor Name",
    dataIndex: "Distributor Name",
    key: "Distributor Name",
  },
  {
    title: "Telephone",
    dataIndex: "Telephone",
    key: "Telephone",
  },
  {
    title: "Address",
    dataIndex: "Address",
    key: "Address",
  },
  {
    title: "E-Mail Address",
    dataIndex: "E-Mail Address",
    key: "E-Mail Address",
  },
  {
    title: "Working?",
    key: "action-feedback",
    fixed: "right",
    width: 100,
    render: () => (
      <div className="vote-wrapper">
        <Button className="vote-button" icon={<UpvoteIcon />}>
          12
        </Button>
        <Button className="vote-button" icon={<DownvoteIcon />}>
          2
        </Button>
      </div>
    ),
  },
]

const CategoryComponent = ({ category, stateContext }) => {
  const { selectedState } = stateContext

  // fetch all by default
  let dbRef = db.ref(`${SPREADSHEET_KEY}/${category}`)
  // if state is selected in the context (from the header)
  // filter based on state
  if (selectedState) {
    dbRef = db
      .ref(`${SPREADSHEET_KEY}/${category}`)
      .orderByChild("State")
      .equalTo(selectedState)
  }
  // Update columns
  // -> Show state column if no state is selected
  const columns = !selectedState
    ? COLUMNS
    : COLUMNS.filter((x) => x.key !== "State")

  return <Table dbRef={dbRef} columns={columns} />
}

// Fetches data for the category and displays in the antd table
const Category = () => {
  const history = useHistory()
  let { category } = useParams()

  const stateContext = useContext(StateContext)
  const { loadingState } = stateContext

  // Only fetch category from firebase if it is in the approved list of CATEGORIES
  if (!CATEGORIES.includes(toTitleCase(category))) {
    return (
      <Result
        status="404"
        title="404"
        subTitle={`Requested category ${category} not found`}
        extra={
          <Button onClick={() => history.push("/")} type="primary">
            Back Home
          </Button>
        }
      />
    )
  }
  if (loadingState) {
    // Loading when state being fetched from geolocation
    return <Loader />
  } else {
    return <CategoryComponent category={category} stateContext={stateContext} />
  }
}

export default Category
