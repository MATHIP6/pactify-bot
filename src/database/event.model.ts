import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { Attribute, NotNull } from "@sequelize/core/decorators-legacy";

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    @Attribute(DataTypes.STRING)
    @NotNull
    declare guild: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare channel: string;

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    declare mustMention: boolean;

    @Attribute(DataTypes.STRING)
    declare role: string | null;
}

export default Event;
