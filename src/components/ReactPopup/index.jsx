import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

import './index.css'

import SummaryPage from '../SummaryPage'

const ReactPopUp = ({total, items}) => (
  <div className="popup-container">
    <Popup
      modal
      trigger={
        <button type="button" className="trigger-button">
          Place Order
        </button>
      }
    >
      {close => (
          <div>
            <SummaryPage total={total} items={items} />
            <button
            type="button"
            className="trigger-button"
            onClick={() => close()}
          >
            Close
          </button>
          </div>
      )}
    </Popup>
  </div>
)
export default ReactPopUp
