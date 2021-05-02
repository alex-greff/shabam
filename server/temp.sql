SELECT C.couple_enc FROM couple AS C
WHERE (C.couple_enc & 4294967295) = $1 AND C.address_enc = $2;

SELECT ?? FROM couple AS C
WHERE 
  -- must belong to current track
  (C.couple_enc & 4294967295) = $1
  -- abs time of track freq point = abs time of clip freq note + delta
  -- (within a tolerance)
  -- TODO: is this the right think? b/c theres gonna be tons of them from the
  -- target zone generation stuff
  abs((C.couple_enc & 18446744069414584320) - ($2 + $3)) > 0.00001 


-- ???
  ((C.address_enc & -8388608) >> 23) 