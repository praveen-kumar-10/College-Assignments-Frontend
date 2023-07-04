import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { default as OverlayTooltip } from "react-bootstrap/Tooltip";

const Tooltip = ({ title, children }) => {
  const renderTooltip = (props) => (
    <OverlayTooltip id="button-tooltip" {...props}>
      {title}
    </OverlayTooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 450, hide: 400 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default Tooltip;
