import {FeedEventsT} from "../../../../utils/types/types";

interface EventBlockPropsT {
    events: FeedEventsT[]
}
const EventBlock = ({events}: EventBlockPropsT) => {
    return (
        <>
            {events && events.length !== 0 ? (
                <div className="events-block">
                    <span className="events-block__title">
                        {events.map(event => (
                            <a>event.text</a>
                            ))}
                    </span>

                </div>
            ) : null}
        </>
    )
}

export default EventBlock